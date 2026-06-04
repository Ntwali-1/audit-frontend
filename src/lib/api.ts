const API_URL = typeof window !== 'undefined'
  ? (import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
  : 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('auth_user');
  window.location.href = '/';
}

async function doFetch(path: string, token: string | null, options?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res = await doFetch(path, getToken(), options);

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        localStorage.setItem('access_token', tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem('refresh_token', tokens.refreshToken);
        res = await doFetch(path, tokens.accessToken, options);
      } else {
        clearSession();
        throw new Error('Session expired. Please log in again.');
      }
    } else {
      clearSession();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    const msg = Array.isArray(body.message) ? body.message[0] : (body.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

// --- Types ---
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  isVerified: boolean;
  profileCompleted: boolean;
  requiresProfileCompletion?: boolean;
  createdAt?: string;
}

export interface ApiAudit {
  id: string;
  title: string;
  type: string | null;
  scope: string | null;
  description: string | null;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdById: string;
  createdBy?: ApiUser;
  teamId: string | null;
  team?: { id: string; name: string } | null;
  steps?: ApiAuditStep[];
  assignments?: ApiAssignment[];
  _count?: { assignments: number; steps: number };
  createdAt: string;
  updatedAt: string;
}

export interface ApiAuditStep {
  id: string;
  auditId: string;
  title: string;
  description: string | null;
  position: number;
  status: string;
  dueDate: string | null;
  assigneeId: string | null;
  assignee?: ApiUser | null;
  completedAt: string | null;
  completionNotes: string | null;
  evidence: ApiEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiEvidence {
  id: string;
  stepId: string;
  uploadedById: string;
  fileName: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export interface ApiAssignment {
  id: string;
  auditId: string;
  userId: string | null;
  teamId: string | null;
  user?: ApiUser | null;
  team?: { id: string; name: string } | null;
}

export interface ApiFinding {
  id: string;
  auditId: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  deadline: string | null;
  assigneeId: string | null;
  assignee?: ApiUser | null;
  createdById: string;
  createdBy?: ApiUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeam {
  id: string;
  name: string;
  description: string | null;
  teamLeadId: string | null;
  teamLead?: ApiUser | null;
  members?: ApiTeamMember[];
  _count?: { members: number };
  createdAt: string;
  updatedAt: string;
}

export interface ApiTeamMember {
  id: string;
  userId: string;
  teamId: string;
  user?: ApiUser;
}

export interface AuditListResponse {
  data: ApiAudit[];
  total: number;
  skip: number;
  take: number;
}

export interface FindingListResponse {
  data: ApiFinding[];
  total: number;
  skip: number;
  take: number;
}

export interface DashboardResponse {
  total: number;
  overdue: number;
  upcoming: number;
  byStatus: Record<string, number>;
}

export interface CreateAuditInput {
  title: string;
  type?: string;
  scope?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  teamId?: string;
}

export interface CreateFindingInput {
  auditId: string;
  title: string;
  description?: string;
  severity: string;
  deadline?: string;
}

// --- API functions ---
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getInvitationInfo: (token: string) =>
    apiFetch<{ email: string; fullName: string; phone: string; role: string }>(
      `/auth/invitations/info?token=${encodeURIComponent(token)}`,
    ),
  acceptInvitation: (data: { token: string; firstName: string; lastName: string; phone?: string; password: string }) =>
    apiFetch<LoginResponse>('/auth/invitations/accept', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getProfile: () => apiFetch<ApiUser>('/auth/me'),
  updateProfile: (data: { firstName?: string; lastName?: string }) =>
    apiFetch<ApiUser>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const auditsApi = {
  getAll: (params?: { skip?: number; take?: number; status?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiFetch<AuditListResponse>(`/audits${qs}`);
  },
  getById: (id: string) => apiFetch<ApiAudit>(`/audits/${id}`),
  getDashboard: () => apiFetch<DashboardResponse>('/audits/dashboard'),
  create: (data: CreateAuditInput) =>
    apiFetch<ApiAudit>('/audits', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateAuditInput>) =>
    apiFetch<ApiAudit>(`/audits/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateStatus: (id: string) =>
    apiFetch<ApiAudit>(`/audits/${id}/status`, { method: 'PATCH' }),
  getTimeline: (id: string) =>
    apiFetch<Array<{ id: string; eventType: string; message: string; actor?: ApiUser; createdAt: string }>>(`/audits/${id}/timeline`),
};

export const findingsApi = {
  getAll: (params?: { auditId?: string; status?: string; skip?: number; take?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    return apiFetch<FindingListResponse>(`/findings${qs}`);
  },
  create: (data: CreateFindingInput) =>
    apiFetch<ApiFinding>('/findings', { method: 'POST', body: JSON.stringify(data) }),
};

export interface ApiReport {
  id: string;
  auditId: string;
  title: string;
  filePath: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export const teamsApi = {
  getAll: () =>
    apiFetch<{ data: ApiTeam[]; total: number; skip: number; take: number }>('/teams?take=100').then(
      (res) => res.data,
    ),
  getById: (id: string) => apiFetch<ApiTeam>(`/teams/${id}`),
  create: (data: { name: string; description?: string; teamLeadId: string; memberIds: string[] }) =>
    apiFetch<ApiTeam>('/teams', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name?: string; description?: string }) =>
    apiFetch<ApiTeam>(`/teams/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/teams/${id}`, { method: 'DELETE' }),
  addMember: (teamId: string, userId: string) =>
    apiFetch<ApiTeamMember>(`/teams/${teamId}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),
  removeMember: (teamId: string, userId: string) =>
    apiFetch<{ message: string }>(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' }),
  assignLead: (teamId: string, teamLeadId: string) =>
    apiFetch<ApiTeam>(`/teams/${teamId}/lead`, { method: 'PATCH', body: JSON.stringify({ teamLeadId }) }),
};

export const usersApi = {
  getAll: () =>
    apiFetch<{ data: ApiUser[]; total: number; skip: number; take: number }>('/users?take=100'),
  changeRole: (id: string, role: string) =>
    apiFetch<ApiUser>(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deactivate: (id: string) =>
    apiFetch<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};

export const reportsApi = {
  getAll: (params?: { auditId?: string }) => {
    const qs = params?.auditId ? `?auditId=${params.auditId}` : '';
    return apiFetch<{ data: ApiReport[]; total: number; skip: number; take: number }>(`/reports${qs}`);
  },
  generate: (auditId: string) =>
    apiFetch<ApiReport>('/reports/generate', { method: 'POST', body: JSON.stringify({ auditId }) }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/reports/${id}`, { method: 'DELETE' }),
};

export const findingsApi2 = {
  update: (id: string, data: { title?: string; description?: string; severity?: string; deadline?: string }) =>
    apiFetch<ApiFinding>(`/findings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  transitionStatus: (id: string, status: string) =>
    apiFetch<ApiFinding>(`/findings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/findings/${id}`, { method: 'DELETE' }),
};

export const inviteApi = {
  inviteAuditManager: (email: string, fullName?: string, phone?: string) =>
    apiFetch<{ message: string }>('/auth/invitations/audit-managers', {
      method: 'POST',
      body: JSON.stringify({ email, ...(fullName ? { fullName } : {}), ...(phone ? { phone } : {}) }),
    }),
  inviteAuditor: (email: string, fullName?: string, phone?: string) =>
    apiFetch<{ message: string }>('/auth/invitations/auditors', {
      method: 'POST',
      body: JSON.stringify({ email, ...(fullName ? { fullName } : {}), ...(phone ? { phone } : {}) }),
    }),
};

// Allowed finding status transitions
export const FINDING_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['IN_REMEDIATION'],
  IN_REMEDIATION: ['RESOLVED', 'ACCEPTED_RISK'],
  RESOLVED: ['CLOSED'],
  ACCEPTED_RISK: ['CLOSED'],
  CLOSED: [],
};

// --- Display helpers ---
export const AUDIT_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  UNDER_REVIEW: 'Under Review',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
};

export const FINDING_STATUS_LABEL: Record<string, string> = {
  OPEN: 'Open',
  IN_REMEDIATION: 'In Remediation',
  RESOLVED: 'Resolved',
  ACCEPTED_RISK: 'Accepted Risk',
  CLOSED: 'Closed',
};

export const SEVERITY_LABEL: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export function getAuditProgress(audit: ApiAudit): number {
  if (!audit.steps || audit.steps.length === 0) {
    if (audit.status === 'COMPLETED' || audit.status === 'CLOSED') return 100;
    if (audit.status === 'DRAFT') return 0;
    return 25;
  }
  const completed = audit.steps.filter((s) => s.status === 'COMPLETED').length;
  return Math.round((completed / audit.steps.length) * 100);
}

export function getUserDisplayName(user?: ApiUser | null): string {
  if (!user) return 'Unknown';
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.email;
}

export function getUserInitials(user?: ApiUser | null): string {
  if (!user) return '?';
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  if (user.firstName) return user.firstName[0].toUpperCase();
  return user.email[0].toUpperCase();
}
