import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, ClipboardCheck, FileBarChart, Settings, LogOut, ShieldCheck,
  Users, UsersRound, Building2, AlertOctagon, Sparkles, Bell, ChartPie,
  ChevronsLeft, ChevronsRight, ChevronDown,
  Send, Briefcase, Inbox, Globe2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth, useBrandMark, isPlatformOrganization, type PortalType } from "@/lib/auth-context";
import { findingsApi, getUserInitials, getUserDisplayName } from "@/lib/api";

export type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  adminOnly?: boolean;
  managerOnly?: boolean;
  auditorOnly?: boolean;
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  /** Portals this section belongs to. Omitted means the institution product. */
  portals?: PortalType[];
  /** Public bodies only — hidden from private organizations. */
  publicOnly?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics", icon: ChartPie, managerOnly: true },
      { to: "/notifications", label: "Inbox", icon: Bell },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      /*
       * Auditors see the whole programme read-only — knowing what the
       * institution is working on is part of the job. Evaluations stays their
       * own queue: the subset they can actually act on.
       */
      { to: "/audits", label: "Audits", icon: ClipboardList },
      { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck, auditorOnly: true },
      { to: "/findings", label: "Findings", icon: AlertOctagon },
      { to: "/reports", label: "Reports", icon: FileBarChart, managerOnly: true },
    ],
  },
  {
    id: "directory",
    label: "Directory",
    items: [
      { to: "/users", label: "Users", icon: Users, adminOnly: true },
      /* Managers get the whole directory; an auditor gets their own team. */
      { to: "/teams", label: "Teams", icon: UsersRound },
    ],
  },
  {
    id: "statutory",
    label: "Statutory reporting",
    portals: ["INSTITUTION"],
    // Public bodies only — a private organization owes nothing to OAG or OCIA,
    // so the section is not just empty for them, it is meaningless.
    publicOnly: true,
    items: [{ to: "/submissions", label: "Submissions", icon: Send }],
  },

  // -- OAG portal ------------------------------------------------------------
  {
    id: "oag",
    label: "External audit",
    portals: ["OAG"],
    items: [
      { to: "/oag/engagements", label: "Engagements", icon: Briefcase },
      { to: "/oag/findings", label: "External findings", icon: AlertOctagon },
      { to: "/oag/submissions", label: "Filings received", icon: Inbox },
    ],
  },

  // -- OCIA portal -----------------------------------------------------------
  {
    id: "ocia",
    label: "Oversight",
    portals: ["OCIA"],
    items: [
      { to: "/ocia", label: "National overview", icon: Globe2 },
      { to: "/ocia/compliance", label: "Compliance", icon: ClipboardCheck },
      { to: "/ocia/submissions", label: "Filings received", icon: Inbox },
    ],
  },

  {
    id: "intel",
    label: "Intelligence",
    items: [
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },

  // Shown only to platform operators, whatever portal they sit in.
  {
    id: "platform",
    label: "Platform",
    items: [{ to: "/platform", label: "Institutions", icon: Building2 }],
  },
];

const SEEN_KEY = "auditly:seen_findings";
const SEEN_EVENT = "auditly:seen-changed";

export function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(JSON.parse(raw || "[]"));
  } catch {
    return new Set();
  }
}

function persistSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(SEEN_EVENT));
  } catch {}
}

export function markAllSeen(ids: string[]) {
  persistSeen(ids);
}

export function markOneSeen(id: string) {
  const seen = getSeenIds();
  if (!seen.has(id)) {
    seen.add(id);
    persistSeen(Array.from(seen));
  }
}

export function useNavBadges() {
  const { data: openFindings } = useQuery({
    queryKey: ["findings", "open"],
    queryFn: () => findingsApi.getAll({ status: "OPEN", take: 100 }),
    staleTime: 30_000,
  });

  const [seenIds, setSeenIds] = React.useState<Set<string>>(() => getSeenIds());

  React.useEffect(() => {
    const handler = () => setSeenIds(getSeenIds());
    window.addEventListener(SEEN_EVENT, handler);
    return () => window.removeEventListener(SEEN_EVENT, handler);
  }, []);

  const openCount = openFindings?.total ?? 0;
  const findings = openFindings?.data ?? [];
  const unreadCount = findings.filter((f) => !seenIds.has(f.id)).length;

  return { openCount, unreadCount, findings, seenIds };
}

/** Sections available to every portal — identity, not audit work. */
const SHARED_SECTIONS = new Set(["intel"]);

export function useNavSections(): NavSection[] {
  const { user, portal } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const isAuditor = user?.role === "AUDITOR" || user?.role === "LEAD_AUDITOR";

  const isPlatformAdmin = !!user?.isPlatformAdmin;

  return NAV_SECTIONS
    // Portal first: OAG and OCIA are different applications, not different
    // permission levels, so they never see the institution's audit navigation.
    .filter((s) => {
      // Platform operations sit outside the portals entirely.
      if (s.id === "platform") return isPlatformAdmin;
      if (SHARED_SECTIONS.has(s.id)) return true;
      if (s.publicOnly && user?.organizationType === "PRIVATE_COMPANY") return false;
      const portals = s.portals ?? ["INSTITUTION"];
      return portals.includes(portal);
    })
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => {
        if (i.adminOnly && !isAdmin) return false;
        if (i.managerOnly && !isManager) return false;
        if (i.auditorOnly && !isAuditor) return false;
        return true;
      }),
    }))
    .filter((s) => s.items.length > 0);
}

const STORAGE_KEY = "auditly:sidebar:collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  React.useEffect(() => {
    try { if (window.localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true); } catch {}
  }, []);
  React.useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);
  return { collapsed, toggle: () => setCollapsed((c) => !c), setCollapsed };
}

export function OrbitalSidebar({
  collapsed,
  onToggle,
}: { collapsed: boolean; onToggle: () => void }) {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, clearAuth, isLoading } = useAuth();
  const { openCount, unreadCount } = useNavBadges();
  const navSections = useNavSections();
  const brand = useBrandMark();
  /*
   * The platform's own organization is a container for the operator's account,
   * not an institution, so the shell is not branded with its name — it would
   * read as though the operator were signed into a body being audited.
   */
  const organizationName = isPlatformOrganization(user?.organizationId)
    ? null
    : (user?.organizationName ?? null);

  const badgeFor = (to: string): number | undefined => {
    if (to === "/notifications") return unreadCount > 0 ? unreadCount : undefined;
    if (to === "/findings") return openCount > 0 ? openCount : undefined;
    return undefined;
  };

  const handleSignOut = () => {
    clearAuth();
    navigate({ to: "/" });
  };

  // Before the stored session has been read there is no user to name yet.
  // Showing "Unknown" in that gap is what made the shell look broken until a
  // manual reload, so it stays blank instead.
  const initials = isLoading && !user ? "" : getUserInitials(user ?? undefined);
  const displayName = isLoading && !user ? "" : getUserDisplayName(user ?? undefined);
  const roleLabel = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "relative hidden shrink-0 flex-col bg-linen transition-[width] duration-300 ease-out md:flex",
        collapsed ? "md:w-[64px]" : "md:w-[256px]",
      )}
      style={{ backgroundColor: "var(--brown-800)" }}
    >
      {/* Toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-7 z-30 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-[color:var(--brown-600)] shadow-md hover:bg-[color:var(--brown-50)]"
        style={{ borderColor: "var(--border-default)" }}
      >
        {collapsed ? <ChevronsRight className="h-3 w-3" /> : <ChevronsLeft className="h-3 w-3" />}
      </button>

      {/* Logo area */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 px-4 border-b",
          collapsed && "justify-center px-0",
        )}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
          {/*
            Once signed in the mark belongs to the organization: government
            bodies and the two national offices carry the coat of arms,
            everyone else carries the product logo.
          */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/95">
            <img src={brand.src} alt={brand.alt} className="h-6 w-6 object-contain" />
          </div>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold leading-tight tracking-tight text-white font-display">
                Auditly
              </span>
              {organizationName && (
                <span className="block truncate text-[11px] leading-tight"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  {organizationName}
                </span>
              )}
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, idx) => (
          <div key={section.id} className={cn(idx > 0 && "mt-4")}>
            {!collapsed && (
              <div
                className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }}
              >
                {section.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                const badge = badgeFor(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex h-11 items-center rounded-lg px-3 text-[14px] font-medium transition-all duration-150",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "text-white"
                          : "text-white/65 hover:translate-x-0.5 hover:bg-white/[0.08] hover:text-white",
                      )}
                      style={isActive ? { backgroundColor: "var(--brown-600)" } : undefined}
                    >
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                          style={{ backgroundColor: "var(--brown-200)" }}
                        />
                      )}
                      <Icon className={cn("h-[18px] w-[18px] shrink-0", !collapsed && "mr-3")} strokeWidth={1.75} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {badge != null && (
                            <span
                              className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
                              style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
                            >
                              {badge > 99 ? "99+" : badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge != null && (
                        <span
                          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: "var(--brown-200)" }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile area */}
      <div
        className={cn("border-t p-3", collapsed && "flex justify-center")}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {collapsed ? (
          <button
            onClick={() => navigate({ to: "/settings" })}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
          >
            {initials}
          </button>
        ) : (
          <button
            onClick={() => navigate({ to: "/settings" })}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/[0.06]"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
              style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-white/90">{displayName}</div>
              <div className="truncate text-[11px] text-white/45">{roleLabel}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-white/45" />
          </button>
        )}
        {!collapsed && (
          <button
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85"
          >
            <LogOut className="h-[16px] w-[16px]" strokeWidth={1.75} />
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
