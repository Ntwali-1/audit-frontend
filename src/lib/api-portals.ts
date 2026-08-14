/**
 * The three-portal half of the API surface: organizations, external audit
 * engagements, oversight aggregates, and statutory report submissions.
 *
 * Kept separate from api.ts so the original institution product stays exactly
 * where it was. Shared plumbing (auth headers, refresh, error shaping) comes
 * from there.
 */
import {
  apiFetch,
  doFetch,
  getToken,
  type ApiAudit,
  type ApiFinding,
  type ApiUser,
} from './api';

export type PortalType = 'INSTITUTION' | 'OAG' | 'OCIA';

export type OrganizationType =
  | 'GOVERNMENT_DISTRICT'
  | 'GOVERNMENT_INSTITUTION'
  | 'PRIVATE_COMPANY'
  | 'OAG'
  | 'OCIA';

/** Types that owe yearly reports to OAG/OCIA. Private bodies owe nothing. */
export const PUBLIC_ORG_TYPES: OrganizationType[] = [
  'GOVERNMENT_DISTRICT',
  'GOVERNMENT_INSTITUTION',
];

export const ORG_TYPE_LABEL: Record<string, string> = {
  GOVERNMENT_DISTRICT: 'District',
  GOVERNMENT_INSTITUTION: 'Government institution',
  PRIVATE_COMPANY: 'Private company',
  OAG: 'Auditor General',
  OCIA: 'Chief Internal Auditor',
};

export interface ApiOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  requireFindingSegregation: boolean;
  createdAt: string;
  _count?: { users: number; audits: number; teams: number };
}

export interface ApiEngagementMember {
  id: string;
  userId: string;
  role: 'LEAD' | 'MEMBER';
  user: ApiUser;
}

export interface ApiEngagement {
  id: string;
  institutionOrgId: string;
  institution: { id: string; name: string; type: OrganizationType };
  oagAuditorId: string;
  oagAuditor: ApiUser;
  year: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  accessStartsAt: string;
  accessEndsAt: string;
  revokedAt: string | null;
  members: ApiEngagementMember[];
  _count?: { findings: number };
  createdAt: string;
}

export interface ApiExternalFinding {
  id: string;
  engagementId: string;
  engagement: {
    id: string;
    year: number;
    institutionOrgId: string;
    institution: { id: string; name: string };
  };
  title: string;
  description: string | null;
  severity: string;
  status: string;
  deadline: string | null;
  assigneeId: string | null;
  assignee: ApiUser | null;
  createdById: string;
  createdBy: ApiUser | null;
  resolutionNote: string | null;
  submittedForVerificationAt: string | null;
  verifiedById: string | null;
  verifiedBy: ApiUser | null;
  verifiedAt: string | null;
  verificationNote: string | null;
  closedAt: string | null;
  createdAt: string;
}

export interface ApiTimelineEvent {
  id: string;
  eventType: string;
  message: string;
  fromFindingStatus: string | null;
  toFindingStatus: string | null;
  actor: ApiUser | null;
  createdAt: string;
}

export type SubmissionRecipient = 'OAG' | 'OCIA' | 'BOTH';
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'RETURNED';

export interface ApiSubmissionCycle {
  id: string;
  title: string;
  description: string | null;
  year: number;
  dueDate: string;
  recipient: SubmissionRecipient;
  appliesTo: OrganizationType[];
  closedAt: string | null;
  _count?: { submissions: number };
}

export interface ApiSubmission {
  id: string;
  cycleId: string | null;
  cycle: {
    id: string;
    title: string;
    year: number;
    dueDate: string;
    recipient: SubmissionRecipient;
  } | null;
  organizationId: string;
  organization: { id: string; name: string; type: OrganizationType };
  title: string;
  narrative: string | null;
  year: number;
  recipient: SubmissionRecipient;
  status: SubmissionStatus;
  dueDate: string | null;
  submittedBy: ApiUser | null;
  submittedAt: string | null;
  reviewedBy: ApiUser | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  reports: Array<{
    id: string;
    reportId: string;
    report: { id: string; title: string; auditId: string; createdAt: string };
  }>;
  attachments: Array<{ id: string; fileName: string; fileUrl: string }>;
  createdAt: string;
}

export interface ApiObligation {
  cycle: ApiSubmissionCycle;
  submissionId: string | null;
  status: SubmissionStatus | null;
  submittedAt: string | null;
  overdue: boolean;
  daysRemaining: number;
}

// -- Institution registration and platform review ---------------------------

export type OrganizationStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export const ORG_STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: 'Awaiting approval',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  REJECTED: 'Rejected',
};

export interface RegisterInstitutionPayload {
  institution: {
    name: string;
    type: OrganizationType;
    district?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  };
  registrant: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    jobTitle?: string;
    phone?: string;
  };
  team?: Array<{ email: string; fullName?: string; role: 'AUDITOR' | 'LEAD_AUDITOR' }>;
}

export interface PendingOrganization extends Omit<ApiOrganization, '_count'> {
  status: OrganizationStatus;
  district: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  requestedByEmail: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  /** The pending-queue endpoint returns fewer counts than the detail endpoint. */
  _count?: { users: number; audits?: number; teams?: number };
}

/**
 * The full picture of one organization, for the platform operator.
 *
 * Aggregates and directory only — running the platform is not a licence to
 * read an institution's audit work, so nothing here carries finding or
 * evidence content.
 */
export interface OrganizationDetail {
  organization: PendingOrganization & {
    reviewedBy: ApiUser | null;
    updatedAt: string;
    _count: {
      users: number;
      audits: number;
      teams: number;
      invitations: number;
      submissions: number;
      engagements: number;
    };
  };
  users: Array<ApiUser & { isPlatformAdmin: boolean; createdAt: string }>;
  teams: Array<{ id: string; name: string; teamLeadId: string | null; _count: { members: number } }>;
  pendingInvitations: Array<{
    id: string;
    email: string;
    role: string;
    sentAt: string | null;
    expiresAt: string;
  }>;
  recentAudits: Array<{
    id: string;
    title: string;
    type: string | null;
    status: string;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
    team: { id: string; name: string } | null;
  }>;
  stats: {
    auditsByStatus: Record<string, number>;
    overdueAudits: number;
    usersByRole: Record<string, number>;
    unverifiedUsers: number;
    findingsTotal: number;
    findingsOpen: number;
    findingsBySeverity: Record<string, number>;
    findingsByStatus: Record<string, number>;
    submissionsByStatus: Record<string, number>;
  };
}

/** Public — no token required. */
export const registrationApi = {
  registerInstitution: (payload: RegisterInstitutionPayload) =>
    apiFetch<{
      organizationId: string;
      status: OrganizationStatus;
      teamInvitesQueued: number;
      message: string;
    }>('/registration/institutions', { method: 'POST', body: JSON.stringify(payload) }),
};

export const platformApi = {
  organizations: (params?: { status?: OrganizationStatus; type?: OrganizationType }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.type) qs.set('type', params.type);
    const q = qs.toString();
    return apiFetch<PendingOrganization[]>(`/platform/organizations${q ? `?${q}` : ''}`);
  },
  pending: () => apiFetch<PendingOrganization[]>('/platform/organizations/pending'),
  organization: (id: string) => apiFetch<OrganizationDetail>(`/platform/organizations/${id}`),
  approve: (id: string, note?: string) =>
    apiFetch<{ message: string; invitationsSent?: number }>(
      `/platform/organizations/${id}/approve`,
      { method: 'POST', body: JSON.stringify({ ...(note ? { note } : {}) }) },
    ),
  reject: (id: string, note: string) =>
    apiFetch<{ message: string }>(`/platform/organizations/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  suspend: (id: string, note?: string) =>
    apiFetch<{ message: string }>(`/platform/organizations/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ ...(note ? { note } : {}) }),
    }),
  reinstate: (id: string) =>
    apiFetch<{ message: string }>(`/platform/organizations/${id}/reinstate`, { method: 'POST' }),
};

export const organizationsApi = {
  getAll: (type?: OrganizationType) =>
    apiFetch<ApiOrganization[]>(`/organizations${type ? `?type=${type}` : ''}`),
  getById: (id: string) => apiFetch<ApiOrganization>(`/organizations/${id}`),
  create: (data: { name: string; type: OrganizationType; requireFindingSegregation?: boolean }) =>
    apiFetch<ApiOrganization>('/organizations', { method: 'POST', body: JSON.stringify(data) }),
  update: (
    id: string,
    data: { name?: string; type?: OrganizationType; requireFindingSegregation?: boolean },
  ) =>
    apiFetch<ApiOrganization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const engagementsApi = {
  getAll: (params?: { status?: string; year?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.year) qs.set('year', params.year);
    const q = qs.toString();
    return apiFetch<ApiEngagement[]>(`/oag/engagements${q ? `?${q}` : ''}`);
  },
  getById: (id: string) => apiFetch<ApiEngagement>(`/oag/engagements/${id}`),
  create: (data: {
    institutionOrgId: string;
    year: number;
    accessStartsAt: string;
    accessEndsAt: string;
  }) => apiFetch<ApiEngagement>('/oag/engagements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { status?: string; accessStartsAt?: string; accessEndsAt?: string }) =>
    apiFetch<ApiEngagement>(`/oag/engagements/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  revoke: (id: string) =>
    apiFetch<{ message: string }>(`/oag/engagements/${id}/revoke`, { method: 'POST' }),
  addMember: (id: string, userId: string, role?: 'LEAD' | 'MEMBER') =>
    apiFetch<ApiEngagement>(`/oag/engagements/${id}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, ...(role ? { role } : {}) }),
    }),
  removeMember: (id: string, userId: string) =>
    apiFetch<{ message: string }>(`/oag/engagements/${id}/members/${userId}`, { method: 'DELETE' }),
  timeline: (id: string) => apiFetch<ApiTimelineEvent[]>(`/oag/engagements/${id}/timeline`),
  institutionAudits: (id: string) => apiFetch<ApiAudit[]>(`/oag/engagements/${id}/audits`),
  institutionAudit: (id: string, auditId: string) =>
    apiFetch<ApiAudit>(`/oag/engagements/${id}/audits/${auditId}`),
  institutionFindings: (id: string) =>
    apiFetch<ApiFinding[]>(`/oag/engagements/${id}/institution-findings`),
};

export const externalFindingsApi = {
  mine: () => apiFetch<ApiExternalFinding[]>('/external-findings/my'),
  forEngagement: (engagementId: string, status?: string) =>
    apiFetch<ApiExternalFinding[]>(
      `/external-findings/engagement/${engagementId}${status ? `?status=${status}` : ''}`,
    ),
  getById: (id: string) => apiFetch<ApiExternalFinding>(`/external-findings/${id}`),
  timeline: (id: string) => apiFetch<ApiTimelineEvent[]>(`/external-findings/${id}/timeline`),
  create: (
    engagementId: string,
    data: {
      title: string;
      description?: string;
      severity: string;
      assigneeId?: string;
      deadline?: string;
    },
  ) =>
    apiFetch<ApiExternalFinding>(`/external-findings/engagement/${engagementId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch<ApiExternalFinding>(`/external-findings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  resolve: (id: string, note?: string) =>
    apiFetch<ApiExternalFinding>(`/external-findings/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ ...(note ? { note } : {}) }),
    }),
  verify: (id: string, status: string, note?: string) =>
    apiFetch<ApiExternalFinding>(`/external-findings/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    }),
};

export interface OciaOverview {
  institutions: number;
  audits: { total: number; completedThisCycle: number; inProgress: number };
  findings: {
    open: number;
    overdue: number;
    pendingVerification: number;
    closed: number;
    closureRate: number;
  };
  averageDaysToClose: number | null;
  cycleYear: number;
}

export interface OciaInstitutionRow {
  organizationId: string;
  name: string;
  type: string;
  auditsTotal: number;
  auditsCompletedThisCycle: number;
  findingsOpen: number;
  findingsOverdue: number;
  findingsClosed: number;
  closureRate: number;
  averageDaysToClose: number | null;
}

export interface OciaComplianceCycle {
  cycle: {
    id: string;
    title: string;
    year: number;
    dueDate: string;
    recipient: SubmissionRecipient;
    appliesTo: string[];
  };
  eligible: number;
  filed: number;
  outstanding: number;
  onTime: number;
  complianceRate: number;
  institutions: Array<{
    organizationId: string;
    name: string;
    type: string;
    status: string;
    submittedAt: string | null;
    late: boolean;
  }>;
}

export const ociaApi = {
  overview: (year?: number) => apiFetch<OciaOverview>(`/ocia/overview${year ? `?year=${year}` : ''}`),
  institutions: (year?: number) =>
    apiFetch<OciaInstitutionRow[]>(`/ocia/institutions${year ? `?year=${year}` : ''}`),
  trend: (months = 12) =>
    apiFetch<Array<{ month: string; raised: number; closed: number }>>(
      `/ocia/trend?months=${months}`,
    ),
  engagements: (year?: number) =>
    apiFetch<{
      cycleYear: number;
      engagementsByStatus: Record<string, number>;
      externalFindings: { total: number; closed: number; overdue: number };
    }>(`/ocia/engagements${year ? `?year=${year}` : ''}`),
  compliance: (year?: number) =>
    apiFetch<OciaComplianceCycle[]>(`/ocia/compliance${year ? `?year=${year}` : ''}`),
};

export const cyclesApi = {
  getAll: (year?: number) =>
    apiFetch<ApiSubmissionCycle[]>(`/submission-cycles${year ? `?year=${year}` : ''}`),
  create: (data: {
    title: string;
    description?: string;
    year: number;
    dueDate: string;
    recipient: SubmissionRecipient;
    appliesTo: OrganizationType[];
  }) =>
    apiFetch<ApiSubmissionCycle>('/submission-cycles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: { title?: string; description?: string; dueDate?: string; closedAt?: string },
  ) =>
    apiFetch<ApiSubmissionCycle>(`/submission-cycles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const submissionsApi = {
  obligations: () => apiFetch<ApiObligation[]>('/submissions/obligations'),
  getAll: (params?: { status?: SubmissionStatus; year?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.year) qs.set('year', params.year);
    const q = qs.toString();
    return apiFetch<ApiSubmission[]>(`/submissions${q ? `?${q}` : ''}`);
  },
  getById: (id: string) => apiFetch<ApiSubmission>(`/submissions/${id}`),
  create: (data: {
    cycleId?: string;
    title: string;
    narrative?: string;
    year?: number;
    recipient?: SubmissionRecipient;
  }) => apiFetch<ApiSubmission>('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { title?: string; narrative?: string }) =>
    apiFetch<ApiSubmission>(`/submissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  attachReports: (id: string, reportIds: string[]) =>
    apiFetch<ApiSubmission>(`/submissions/${id}/reports`, {
      method: 'POST',
      body: JSON.stringify({ reportIds }),
    }),
  detachReport: (id: string, reportId: string) =>
    apiFetch<ApiSubmission>(`/submissions/${id}/reports/${reportId}`, { method: 'DELETE' }),
  submit: (id: string) => apiFetch<ApiSubmission>(`/submissions/${id}/submit`, { method: 'POST' }),
  review: (id: string, status: SubmissionStatus, note?: string) =>
    apiFetch<ApiSubmission>(`/submissions/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    }),
};

// --- Display helpers -------------------------------------------------------

export const SUBMISSION_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  RETURNED: 'Returned for correction',
  NOT_STARTED: 'Not started',
};

export const ENGAGEMENT_STATUS_LABEL: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

/** Outcomes only an auditor may set. */
export const VERIFICATION_OUTCOMES = [
  { value: 'VERIFIED_CLOSED', label: 'Verified and closed' },
  { value: 'PARTIALLY_RESOLVED', label: 'Partially resolved' },
  { value: 'REJECTED_REOPENED', label: 'Rejected, reopen' },
] as const;

/** True while an engagement's read window into the institution is open. */
export function isEngagementActive(e: ApiEngagement): boolean {
  if (e.revokedAt || e.status === 'CANCELLED') return false;
  const now = Date.now();
  return new Date(e.accessStartsAt).getTime() <= now && new Date(e.accessEndsAt).getTime() >= now;
}

/** Downloads a generated report PDF through the authenticated API. */
export async function downloadReport(id: string, fileName?: string): Promise<void> {
  const res = await doFetch(`/reports/${id}/download`, getToken());
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName ?? `report-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
