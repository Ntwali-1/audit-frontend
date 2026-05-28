export type AuditStatus = "draft" | "in_progress" | "review" | "completed";
export type Severity = "low" | "medium" | "high" | "critical";
export type Role = "SUPER_ADMIN" | "ADMIN" | "AUDIT_MANAGER" | "AUDITOR" | "VIEWER";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type FindingStatus = "open" | "in_remediation" | "resolved" | "accepted_risk" | "closed";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  status: "open" | "resolved";
  auditId?: string;
  reporter?: string;
  assignee?: string;
  due?: string;
}

export interface Audit {
  id: string;
  name: string;
  client: string;
  status: AuditStatus;
  owner: string;
  startDate: string;
  dueDate: string;
  progress: number;
  scope: string;
  findings: Finding[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team?: string;
  initials: string;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  lead: string;
  members: number;
  activeAudits: number;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  risk: RiskLevel;
  contracts: number;
  lastReview: string;
  status: "active" | "review" | "archived";
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  kind: "audit" | "finding" | "report" | "system";
  unread: boolean;
  time: string;
}

export const AUDITS: Audit[] = [
  {
    id: "AUD-001",
    name: "Q4 Financial Controls Review",
    client: "Northwind Holdings",
    status: "in_progress",
    owner: "Sarah Chen",
    startDate: "2026-04-12",
    dueDate: "2026-06-15",
    progress: 64,
    scope: "Review of internal financial controls across all subsidiaries for Q4 2025.",
    findings: [
      { id: "F-1", title: "Segregation of duties gap in AP", severity: "high", description: "Same user can create and approve vendor payments under $5k.", status: "open" },
      { id: "F-2", title: "Manual journal entries unreviewed", severity: "medium", description: "12% of manual JEs lack secondary review.", status: "open" },
      { id: "F-3", title: "Bank reconciliation timing", severity: "low", description: "Reconciliations completed on average 9 days late.", status: "resolved" },
    ],
  },
  {
    id: "AUD-002",
    name: "SOC 2 Type II Readiness",
    client: "Helix Cloud",
    status: "review",
    owner: "Marcus Patel",
    startDate: "2026-03-01",
    dueDate: "2026-05-30",
    progress: 88,
    scope: "Pre-assessment of security, availability, and confidentiality controls.",
    findings: [
      { id: "F-1", title: "Access review cadence", severity: "medium", description: "Quarterly reviews missing for 3 production systems.", status: "open" },
      { id: "F-2", title: "Encryption at rest", severity: "critical", description: "Legacy backup bucket not encrypted.", status: "open" },
    ],
  },
  {
    id: "AUD-003",
    name: "Vendor Risk Assessment",
    client: "Atlas Logistics",
    status: "draft",
    owner: "Priya Rao",
    startDate: "2026-05-20",
    dueDate: "2026-07-10",
    progress: 12,
    scope: "Tier-1 vendor security and continuity posture review.",
    findings: [],
  },
  {
    id: "AUD-004",
    name: "GDPR Data Mapping",
    client: "Lumen Retail EU",
    status: "completed",
    owner: "Jonas Berg",
    startDate: "2026-01-10",
    dueDate: "2026-04-01",
    progress: 100,
    scope: "Full data inventory and lawful basis assessment for EU operations.",
    findings: [
      { id: "F-1", title: "Retention policy gap", severity: "low", description: "Customer support tickets retained beyond policy.", status: "resolved" },
    ],
  },
  {
    id: "AUD-005",
    name: "IT General Controls",
    client: "Vertex Manufacturing",
    status: "in_progress",
    owner: "Sarah Chen",
    startDate: "2026-04-25",
    dueDate: "2026-06-30",
    progress: 41,
    scope: "ITGC review across ERP, payroll, and treasury systems.",
    findings: [
      { id: "F-1", title: "Privileged access logging", severity: "high", description: "Admin actions not forwarded to SIEM.", status: "open" },
    ],
  },
];

export const STATUS_LABEL: Record<AuditStatus, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  review: "In Review",
  completed: "Completed",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const USERS: User[] = [
  { id: "U-01", name: "Sarah Chen", email: "sarah@auditly.io", role: "AUDIT_MANAGER", team: "Financial Controls", initials: "SC", active: true },
  { id: "U-02", name: "Marcus Patel", email: "marcus@auditly.io", role: "AUDITOR", team: "Security & Cloud", initials: "MP", active: true },
  { id: "U-03", name: "Priya Rao", email: "priya@auditly.io", role: "AUDITOR", team: "Vendor Risk", initials: "PR", active: true },
  { id: "U-04", name: "Jonas Berg", email: "jonas@auditly.io", role: "AUDIT_MANAGER", team: "Privacy & GDPR", initials: "JB", active: true },
  { id: "U-05", name: "Amelia Cruz", email: "amelia@auditly.io", role: "ADMIN", initials: "AC", active: true },
  { id: "U-06", name: "Daniel Okafor", email: "daniel@auditly.io", role: "VIEWER", team: "Security & Cloud", initials: "DO", active: false },
  { id: "U-07", name: "Hiroshi Tanaka", email: "hiroshi@auditly.io", role: "SUPER_ADMIN", initials: "HT", active: true },
];

export const TEAMS: Team[] = [
  { id: "T-01", name: "Financial Controls", lead: "Sarah Chen", members: 6, activeAudits: 2, description: "SOX, internal controls, financial reporting." },
  { id: "T-02", name: "Security & Cloud", lead: "Marcus Patel", members: 5, activeAudits: 3, description: "SOC 2, ISO 27001, cloud posture." },
  { id: "T-03", name: "Vendor Risk", lead: "Priya Rao", members: 3, activeAudits: 1, description: "Third-party risk and contracts." },
  { id: "T-04", name: "Privacy & GDPR", lead: "Jonas Berg", members: 4, activeAudits: 1, description: "Privacy, GDPR, CCPA, data mapping." },
];

export const VENDORS: Vendor[] = [
  { id: "V-01", name: "Northwind Holdings", category: "Financial services", risk: "high", contracts: 4, lastReview: "2026-03-12", status: "active" },
  { id: "V-02", name: "Helix Cloud", category: "Cloud infrastructure", risk: "critical", contracts: 2, lastReview: "2026-04-02", status: "review" },
  { id: "V-03", name: "Atlas Logistics", category: "Logistics", risk: "medium", contracts: 6, lastReview: "2026-02-22", status: "active" },
  { id: "V-04", name: "Lumen Retail EU", category: "Retail", risk: "low", contracts: 3, lastReview: "2025-12-01", status: "archived" },
  { id: "V-05", name: "Vertex Manufacturing", category: "Manufacturing", risk: "high", contracts: 5, lastReview: "2026-04-18", status: "active" },
  { id: "V-06", name: "Brightline Analytics", category: "Data & analytics", risk: "medium", contracts: 1, lastReview: "2026-05-04", status: "review" },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "N-01", title: "Critical finding logged", body: "Encryption at rest gap on AUD-002 was raised by Marcus.", kind: "finding", unread: true, time: "12m ago" },
  { id: "N-02", title: "Audit status changed", body: "AUD-002 moved to Under Review.", kind: "audit", unread: true, time: "1h ago" },
  { id: "N-03", title: "Report generated", body: "Q1 Compliance Report is ready to download.", kind: "report", unread: true, time: "3h ago" },
  { id: "N-04", title: "Vendor risk updated", body: "Helix Cloud reclassified to Critical.", kind: "system", unread: false, time: "Yesterday" },
  { id: "N-05", title: "Step completed", body: "Sarah completed 'Walkthrough of journal entries'.", kind: "audit", unread: false, time: "2d ago" },
];

export const ALL_FINDINGS: Finding[] = AUDITS.flatMap((a) =>
  a.findings.map((f) => ({
    ...f,
    auditId: a.id,
    reporter: a.owner,
    assignee: a.owner,
    due: a.dueDate,
  })),
);
