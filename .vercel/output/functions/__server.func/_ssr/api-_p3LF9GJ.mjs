import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const API_URL = typeof window !== "undefined" ? "https://audit-ms.onrender.com/api" : "http://localhost:3000";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}
function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}
function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
  window.location.href = "/";
}
async function doFetch(path, token, options) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...options?.headers ?? {}
    }
  });
}
async function apiFetch(path, options) {
  let res = await doFetch(path, getToken(), options);
  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        localStorage.setItem("access_token", tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem("refresh_token", tokens.refreshToken);
        res = await doFetch(path, tokens.accessToken, options);
      } else {
        clearSession();
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      clearSession();
      throw new Error("Session expired. Please log in again.");
    }
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    const msg = Array.isArray(body.message) ? body.message[0] : body.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}
const authApi = {
  login: (email, password) => apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }),
  getInvitationInfo: (token) => apiFetch(
    `/auth/invitations/info?token=${encodeURIComponent(token)}`
  ),
  acceptInvitation: (data) => apiFetch("/auth/invitations/accept", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  getProfile: () => apiFetch("/auth/me"),
  updateProfile: (data) => apiFetch("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data)
  })
};
const auditsApi = {
  getAll: (params) => {
    const qs = params ? "?" + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== void 0).map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return apiFetch(`/audits${qs}`);
  },
  getMyAudits: () => apiFetch("/audits/my"),
  getById: (id) => apiFetch(`/audits/${id}`),
  getDashboard: () => apiFetch("/audits/dashboard"),
  create: (data) => apiFetch("/audits", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/audits/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateStatus: (id) => apiFetch(`/audits/${id}/status`, { method: "PATCH" }),
  getTimeline: (id) => apiFetch(`/audits/${id}/timeline`),
  /** Staff an audit with individual auditors and/or whole teams. */
  assign: (id, data) => apiFetch(`/audits/${id}/assign`, { method: "POST", body: JSON.stringify(data) })
};
const auditStepsApi = {
  // Manager CRUD
  create: (auditId, data) => apiFetch(`/audits/${auditId}/steps`, { method: "POST", body: JSON.stringify(data) }),
  update: (auditId, stepId, data) => apiFetch(`/audits/${auditId}/steps/${stepId}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (auditId, stepId) => apiFetch(`/audits/${auditId}/steps/${stepId}`, { method: "DELETE" }),
  // Auditor actions
  start: (auditId, stepId) => apiFetch(`/audits/${auditId}/steps/${stepId}/start`, { method: "PATCH" }),
  saveDraft: (auditId, stepId, notes) => apiFetch(`/audits/${auditId}/steps/${stepId}/draft`, {
    method: "PATCH",
    body: JSON.stringify({ notes })
  }),
  complete: (auditId, stepId, notes) => apiFetch(`/audits/${auditId}/steps/${stepId}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ notes })
  }),
  deleteEvidence: (auditId, stepId, fileId) => apiFetch(`/audits/${auditId}/steps/${stepId}/evidence/${fileId}`, { method: "DELETE" }),
  // File upload
  uploadEvidence: async (auditId, stepId, file) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/audits/${auditId}/steps/${stepId}/evidence/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
      throw new Error(Array.isArray(body.message) ? body.message[0] : body.message ?? `HTTP ${res.status}`);
    }
    return res.json();
  }
};
const findingsApi = {
  getAll: (params) => {
    const qs = params ? "?" + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== void 0).map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return apiFetch(`/findings${qs}`);
  },
  create: (data) => apiFetch("/findings", { method: "POST", body: JSON.stringify(data) }),
  /** Findings assigned to the signed-in user — their remediation queue. */
  getMyFindings: () => apiFetch("/findings/my")
};
const teamsApi = {
  getAll: () => apiFetch("/teams?take=100").then(
    (res) => res.data
  ),
  getById: (id) => apiFetch(`/teams/${id}`),
  create: (data) => apiFetch("/teams", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/teams/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/teams/${id}`, { method: "DELETE" }),
  addMember: (teamId, userId) => apiFetch(`/teams/${teamId}/members`, { method: "POST", body: JSON.stringify({ userId }) }),
  removeMember: (teamId, userId) => apiFetch(`/teams/${teamId}/members/${userId}`, { method: "DELETE" }),
  assignLead: (teamId, teamLeadId) => apiFetch(`/teams/${teamId}/lead`, { method: "PATCH", body: JSON.stringify({ teamLeadId }) })
};
const usersApi = {
  getAll: () => apiFetch("/users?take=100"),
  changeRole: (id, role) => apiFetch(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deactivate: (id) => apiFetch(`/users/${id}`, { method: "DELETE" })
};
const reportsApi = {
  getAll: (params) => {
    const qs = params?.auditId ? `?auditId=${params.auditId}` : "";
    return apiFetch(`/reports${qs}`);
  },
  generate: (auditId) => apiFetch("/reports/generate", { method: "POST", body: JSON.stringify({ auditId }) }),
  delete: (id) => apiFetch(`/reports/${id}`, { method: "DELETE" })
};
const findingsApi2 = {
  update: (id, data) => apiFetch(`/findings/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  transitionStatus: (id, status, note) => apiFetch(`/findings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...note ? { note } : {} })
  }),
  delete: (id) => apiFetch(`/findings/${id}`, { method: "DELETE" }),
  /** Institution attaches evidence of a fix. Moves to PENDING_VERIFICATION. */
  resolve: (id, note) => apiFetch(`/findings/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ ...note ? { note } : {} })
  }),
  /** Auditor rules on the evidence. Never the person who remediated it. */
  verify: (id, status, note) => apiFetch(`/findings/${id}/verify`, {
    method: "POST",
    body: JSON.stringify({ status, ...note ? { note } : {} })
  }),
  timeline: (id) => apiFetch(`/findings/${id}/timeline`)
};
const inviteApi = {
  inviteAuditManager: (email, fullName, phone) => apiFetch("/auth/invitations/audit-managers", {
    method: "POST",
    body: JSON.stringify({ email, ...fullName ? { fullName } : {}, ...phone ? { phone } : {} })
  }),
  inviteAuditor: (email, fullName, phone) => apiFetch("/auth/invitations/auditors", {
    method: "POST",
    body: JSON.stringify({ email, ...fullName ? { fullName } : {}, ...phone ? { phone } : {} })
  }),
  /** Audit managers can appoint lead auditors themselves, without an ADMIN. */
  inviteLeadAuditor: (email, fullName, phone) => apiFetch("/auth/invitations/lead-auditors", {
    method: "POST",
    body: JSON.stringify({ email, ...fullName ? { fullName } : {}, ...phone ? { phone } : {} })
  })
};
const FINDING_TRANSITIONS = {
  OPEN: ["IN_REMEDIATION", "ACCEPTED_RISK"],
  IN_REMEDIATION: ["PENDING_VERIFICATION", "ACCEPTED_RISK"],
  PENDING_VERIFICATION: ["VERIFIED_CLOSED", "REJECTED_REOPENED", "PARTIALLY_RESOLVED"],
  REJECTED_REOPENED: ["IN_REMEDIATION"],
  PARTIALLY_RESOLVED: ["IN_REMEDIATION", "VERIFIED_CLOSED"],
  VERIFIED_CLOSED: ["CLOSED"],
  ACCEPTED_RISK: ["CLOSED"],
  RESOLVED: ["CLOSED"],
  // legacy rows only
  CLOSED: []
};
const AUDIT_STATUS_LABEL = {
  DRAFT: "Draft",
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
  CLOSED: "Closed"
};
const FINDING_STATUS_LABEL = {
  OPEN: "Open",
  IN_REMEDIATION: "In Remediation",
  PENDING_VERIFICATION: "Pending Verification",
  VERIFIED_CLOSED: "Verified & Closed",
  REJECTED_REOPENED: "Rejected — Reopened",
  PARTIALLY_RESOLVED: "Partially Resolved",
  RESOLVED: "Resolved",
  ACCEPTED_RISK: "Accepted Risk",
  CLOSED: "Closed"
};
const SEVERITY_LABEL = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical"
};
function getAuditProgress(audit) {
  if (!audit.steps || audit.steps.length === 0) {
    if (audit.status === "COMPLETED" || audit.status === "CLOSED") return 100;
    if (audit.status === "DRAFT") return 0;
    return 25;
  }
  const completed = audit.steps.filter((s) => s.status === "COMPLETED").length;
  return Math.round(completed / audit.steps.length * 100);
}
function getUserDisplayName(user) {
  if (!user) return "Unknown";
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.email;
}
function resolveFileUrl(url) {
  if (!url) return "";
  const marker = url.indexOf("/uploads/");
  if (marker >= 0) return `${API_URL}${url.slice(marker)}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
function getUserInitials(user) {
  if (!user) return "?";
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  if (user.firstName) return user.firstName[0].toUpperCase();
  return user.email[0].toUpperCase();
}
export {
  AUDIT_STATUS_LABEL as A,
  FINDING_STATUS_LABEL as F,
  SEVERITY_LABEL as S,
  getUserInitials as a,
  authApi as b,
  cn as c,
  auditsApi as d,
  FINDING_TRANSITIONS as e,
  findingsApi as f,
  getUserDisplayName as g,
  findingsApi2 as h,
  inviteApi as i,
  getAuditProgress as j,
  doFetch as k,
  getToken as l,
  apiFetch as m,
  auditStepsApi as n,
  resolveFileUrl as o,
  reportsApi as r,
  teamsApi as t,
  usersApi as u
};
