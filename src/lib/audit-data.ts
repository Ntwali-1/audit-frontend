export type AuditStatus = "draft" | "in_progress" | "review" | "completed";
export type Severity = "low" | "medium" | "high" | "critical";

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  status: "open" | "resolved";
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
