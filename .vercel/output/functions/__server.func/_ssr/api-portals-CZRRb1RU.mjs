import { k as doFetch, l as getToken, m as apiFetch } from "./api-_p3LF9GJ.mjs";
const PUBLIC_ORG_TYPES = [
  "GOVERNMENT_DISTRICT",
  "GOVERNMENT_INSTITUTION"
];
const ORG_TYPE_LABEL = {
  GOVERNMENT_DISTRICT: "District",
  GOVERNMENT_INSTITUTION: "Government institution",
  PRIVATE_COMPANY: "Private company",
  OAG: "Auditor General",
  OCIA: "Chief Internal Auditor"
};
const ORG_STATUS_LABEL = {
  PENDING_APPROVAL: "Awaiting approval",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected"
};
const registrationApi = {
  registerInstitution: (payload) => apiFetch("/registration/institutions", { method: "POST", body: JSON.stringify(payload) })
};
const platformApi = {
  organizations: (params) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.type) qs.set("type", params.type);
    const q = qs.toString();
    return apiFetch(`/platform/organizations${q ? `?${q}` : ""}`);
  },
  pending: () => apiFetch("/platform/organizations/pending"),
  approve: (id, note) => apiFetch(
    `/platform/organizations/${id}/approve`,
    { method: "POST", body: JSON.stringify({ ...note ? { note } : {} }) }
  ),
  reject: (id, note) => apiFetch(`/platform/organizations/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ note })
  }),
  suspend: (id, note) => apiFetch(`/platform/organizations/${id}/suspend`, {
    method: "POST",
    body: JSON.stringify({ ...note ? { note } : {} })
  }),
  reinstate: (id) => apiFetch(`/platform/organizations/${id}/reinstate`, { method: "POST" })
};
const organizationsApi = {
  getAll: (type) => apiFetch(`/organizations${type ? `?type=${type}` : ""}`),
  getById: (id) => apiFetch(`/organizations/${id}`),
  create: (data) => apiFetch("/organizations", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/organizations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
};
const engagementsApi = {
  getAll: (params) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.year) qs.set("year", params.year);
    const q = qs.toString();
    return apiFetch(`/oag/engagements${q ? `?${q}` : ""}`);
  },
  getById: (id) => apiFetch(`/oag/engagements/${id}`),
  create: (data) => apiFetch("/oag/engagements", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/oag/engagements/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  revoke: (id) => apiFetch(`/oag/engagements/${id}/revoke`, { method: "POST" }),
  addMember: (id, userId, role) => apiFetch(`/oag/engagements/${id}/members`, {
    method: "POST",
    body: JSON.stringify({ userId, ...role ? { role } : {} })
  }),
  removeMember: (id, userId) => apiFetch(`/oag/engagements/${id}/members/${userId}`, { method: "DELETE" }),
  timeline: (id) => apiFetch(`/oag/engagements/${id}/timeline`),
  institutionAudits: (id) => apiFetch(`/oag/engagements/${id}/audits`),
  institutionAudit: (id, auditId) => apiFetch(`/oag/engagements/${id}/audits/${auditId}`),
  institutionFindings: (id) => apiFetch(`/oag/engagements/${id}/institution-findings`)
};
const externalFindingsApi = {
  mine: () => apiFetch("/external-findings/my"),
  forEngagement: (engagementId, status) => apiFetch(
    `/external-findings/engagement/${engagementId}${status ? `?status=${status}` : ""}`
  ),
  getById: (id) => apiFetch(`/external-findings/${id}`),
  timeline: (id) => apiFetch(`/external-findings/${id}/timeline`),
  create: (engagementId, data) => apiFetch(`/external-findings/engagement/${engagementId}`, {
    method: "POST",
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiFetch(`/external-findings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  }),
  resolve: (id, note) => apiFetch(`/external-findings/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ ...note ? { note } : {} })
  }),
  verify: (id, status, note) => apiFetch(`/external-findings/${id}/verify`, {
    method: "POST",
    body: JSON.stringify({ status, ...note ? { note } : {} })
  })
};
const ociaApi = {
  overview: (year) => apiFetch(`/ocia/overview${year ? `?year=${year}` : ""}`),
  institutions: (year) => apiFetch(`/ocia/institutions${year ? `?year=${year}` : ""}`),
  trend: (months = 12) => apiFetch(
    `/ocia/trend?months=${months}`
  ),
  engagements: (year) => apiFetch(`/ocia/engagements${year ? `?year=${year}` : ""}`),
  compliance: (year) => apiFetch(`/ocia/compliance${year ? `?year=${year}` : ""}`)
};
const cyclesApi = {
  getAll: (year) => apiFetch(`/submission-cycles${year ? `?year=${year}` : ""}`),
  create: (data) => apiFetch("/submission-cycles", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiFetch(`/submission-cycles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
};
const submissionsApi = {
  obligations: () => apiFetch("/submissions/obligations"),
  getAll: (params) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.year) qs.set("year", params.year);
    const q = qs.toString();
    return apiFetch(`/submissions${q ? `?${q}` : ""}`);
  },
  getById: (id) => apiFetch(`/submissions/${id}`),
  create: (data) => apiFetch("/submissions", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/submissions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  attachReports: (id, reportIds) => apiFetch(`/submissions/${id}/reports`, {
    method: "POST",
    body: JSON.stringify({ reportIds })
  }),
  detachReport: (id, reportId) => apiFetch(`/submissions/${id}/reports/${reportId}`, { method: "DELETE" }),
  submit: (id) => apiFetch(`/submissions/${id}/submit`, { method: "POST" }),
  review: (id, status, note) => apiFetch(`/submissions/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ status, ...note ? { note } : {} })
  })
};
const SUBMISSION_STATUS_LABEL = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  ACCEPTED: "Accepted",
  RETURNED: "Returned for correction",
  NOT_STARTED: "Not started"
};
const ENGAGEMENT_STATUS_LABEL = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};
const VERIFICATION_OUTCOMES = [
  { value: "VERIFIED_CLOSED", label: "Verified and closed" },
  { value: "PARTIALLY_RESOLVED", label: "Partially resolved" },
  { value: "REJECTED_REOPENED", label: "Rejected, reopen" }
];
function isEngagementActive(e) {
  if (e.revokedAt || e.status === "CANCELLED") return false;
  const now = Date.now();
  return new Date(e.accessStartsAt).getTime() <= now && new Date(e.accessEndsAt).getTime() >= now;
}
async function downloadReport(id, fileName) {
  const res = await doFetch(`/reports/${id}/download`, getToken());
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName ?? `report-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
export {
  ENGAGEMENT_STATUS_LABEL as E,
  ORG_TYPE_LABEL as O,
  PUBLIC_ORG_TYPES as P,
  SUBMISSION_STATUS_LABEL as S,
  VERIFICATION_OUTCOMES as V,
  ORG_STATUS_LABEL as a,
  engagementsApi as b,
  cyclesApi as c,
  downloadReport as d,
  externalFindingsApi as e,
  organizationsApi as f,
  isEngagementActive as i,
  ociaApi as o,
  platformApi as p,
  registrationApi as r,
  submissionsApi as s
};
