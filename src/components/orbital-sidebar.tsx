import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, FileBarChart, Settings, LogOut, ShieldCheck,
  Users, UsersRound, Building2, AlertOctagon, Sparkles, Bell, ChartPie,
  ChevronsLeft, ChevronsRight, Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  accent?: string; // chart token
};

export type NavSection = { id: string; label: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, accent: "var(--chart-1)" },
      { to: "/analytics", label: "Analytics", icon: ChartPie, accent: "var(--chart-5)" },
      { to: "/notifications", label: "Inbox", icon: Bell, badge: 3, accent: "var(--chart-4)" },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { to: "/audits", label: "Audits", icon: ClipboardList, accent: "var(--chart-1)" },
      { to: "/findings", label: "Findings", icon: AlertOctagon, badge: "12", accent: "var(--destructive)" },
      { to: "/reports", label: "Reports", icon: FileBarChart, accent: "var(--chart-2)" },
    ],
  },
  {
    id: "directory",
    label: "Directory",
    items: [
      { to: "/users", label: "Users", icon: Users, accent: "var(--chart-3)" },
      { to: "/teams", label: "Teams", icon: UsersRound, accent: "var(--chart-2)" },
      { to: "/vendors", label: "Vendors", icon: Building2, accent: "var(--chart-5)" },
    ],
  },
  {
    id: "intel",
    label: "Intelligence",
    items: [
      { to: "/assistant", label: "AI Assistant", icon: Sparkles, accent: "var(--chart-4)" },
      { to: "/settings", label: "Settings", icon: Settings, accent: "var(--chart-3)" },
    ],
  },
];

const STORAGE_KEY = "auditly:sidebar:collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
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

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "group/rail relative hidden shrink-0 transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:flex md:flex-col",
        collapsed ? "md:w-[78px]" : "md:w-[260px]",
      )}
    >
      {/* Rail surface — frosted glass with gradient border and noise */}
      <div className="pointer-events-none absolute inset-y-3 left-3 right-0 rounded-2xl border border-border/60 bg-sidebar/55 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(100,74,64,0.25)]" />
      {/* Animated conic accent ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-3 right-0 rounded-2xl opacity-60"
        style={{
          background:
            "conic-gradient(from 140deg at 30% 0%, transparent 0deg, var(--chart-2) 60deg, transparent 110deg, var(--chart-4) 220deg, transparent 280deg)",
          maskImage: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      {/* Inner grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-3 right-0 rounded-2xl opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Floating toggle orb */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-7 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:scale-110 hover:border-primary hover:text-primary"
      >
        {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-3 py-5">
        {/* Brand */}
        <Link to="/dashboard" className="mb-4 flex items-center gap-3 px-2 py-1">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <ShieldCheck className="h-4 w-4" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            <span className="absolute -inset-1 rounded-xl bg-primary/20 blur-md -z-10" />
          </div>
          <div
            className={cn(
              "flex min-w-0 flex-col leading-tight transition-all duration-300",
              collapsed ? "pointer-events-none -translate-x-2 opacity-0" : "opacity-100",
            )}
          >
            <span className="truncate font-semibold tracking-tight text-sidebar-foreground">Auditly</span>
            <span className="truncate text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              orbital · v0.5
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto pr-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              <div
                className={cn(
                  "mb-1.5 flex items-center gap-2 px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70 transition-opacity duration-300",
                  collapsed && "opacity-0",
                )}
              >
                <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                <span>{section.label}</span>
                <span className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group/item relative flex h-10 items-center gap-3 rounded-xl px-2.5 text-sm transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/40 text-sidebar-accent-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {/* Active sliding indicator: glowing pill on the left */}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-500",
                            isActive ? "opacity-100" : "opacity-0 group-hover/item:opacity-60",
                          )}
                          style={{
                            background: item.accent,
                            boxShadow: isActive ? `0 0 12px 0 ${item.accent}` : undefined,
                          }}
                        />
                        {/* Icon tile */}
                        <span
                          className={cn(
                            "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent transition-all duration-300",
                            isActive
                              ? "border-border/60 bg-card/80 shadow-sm"
                              : "group-hover/item:border-border/40 group-hover/item:bg-card/40",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.badge != null && (
                            <span
                              className={cn(
                                "absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-semibold ring-2 ring-sidebar",
                                "bg-primary text-primary-foreground",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "flex-1 truncate transition-all duration-300",
                            collapsed && "pointer-events-none -translate-x-2 opacity-0",
                          )}
                        >
                          {item.label}
                        </span>
                        {isActive && !collapsed && (
                          <span
                            className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full"
                            style={{ background: item.accent }}
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

        {/* Footer */}
        <div className="mt-4 space-y-2">
          <div
            className={cn(
              "flex items-center justify-between rounded-xl border border-dashed border-border/60 px-3 py-2 text-[11px] text-muted-foreground transition-opacity duration-300",
              collapsed && "opacity-0",
            )}
          >
            <span className="flex items-center gap-1.5"><Command className="h-3 w-3" />Quick search</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">⌘K</kbd>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent hover:border-border/40">
              <LogOut className="h-4 w-4" />
            </span>
            <span className={cn("truncate transition-all", collapsed && "pointer-events-none -translate-x-2 opacity-0")}>
              Sign out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
