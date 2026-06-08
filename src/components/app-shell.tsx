import * as React from "react";
import { useRouterState, Link, useNavigate } from "@tanstack/react-router";
import { Search, Bell, AlertOctagon, ClipboardList, FileBarChart, Settings as SettingsIcon, User, LogOut, UserCircle2, ChevronRight, Menu } from "lucide-react";
import { OrbitalSidebar, NAV_SECTIONS, useSidebarState, useNavBadges, markAllSeen, markOneSeen } from "@/components/orbital-sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { getUserInitials, getUserDisplayName } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/ui/logo";

function findActive(pathname: string) {
  for (const s of NAV_SECTIONS) {
    for (const it of s.items) {
      if (pathname === it.to || pathname.startsWith(it.to + "/")) return { section: s, item: it };
    }
  }
  return null;
}

const SEVERITY_ICON = {
  CRITICAL: AlertOctagon,
  HIGH: AlertOctagon,
  MEDIUM: ClipboardList,
  LOW: FileBarChart,
} as const;

function NotificationsPopover() {
  const { unreadCount, findings, openCount, seenIds } = useNavBadges();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllSeen(findings.map((f) => f.id));
  };

  const handleClick = (auditId: string, findingId: string) => {
    markOneSeen(findingId);
    setOpen(false);
    navigate({ to: "/audits/$id", params: { id: auditId } });
  };

  const displayFindings = findings.slice(0, 6);
  const unread = displayFindings.filter((f) => !seenIds.has(f.id)).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-[color:var(--brown-50)]"
          style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
          aria-label="Notifications"
        >
          <Bell className="h-[16px] w-[16px]" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white"
              style={{ backgroundColor: "var(--brown-800)" }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[380px] p-0 overflow-hidden"
        style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
          <div>
            <p className="font-display text-sm font-semibold" style={{ color: "var(--brown-800)" }}>Notifications</p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{unread} unread</p>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-medium hover:underline"
            style={{ color: "var(--brown-600)" }}
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
          {displayFindings.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
              No open findings right now.
            </div>
          )}
          {displayFindings.map((f) => {
            const isUnread = !seenIds.has(f.id);
            const Icon = SEVERITY_ICON[f.severity as keyof typeof SEVERITY_ICON] ?? AlertOctagon;
            return (
              <button
                key={f.id}
                onClick={() => handleClick(f.auditId, f.id)}
                className={cn(
                  "flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-[color:var(--surface)]",
                  isUnread && "bg-[color:var(--cream)]",
                )}
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-800)" }}
                >
                  <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                      {f.title}
                    </p>
                    {isUnread && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--brown-800)" }} />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {f.severity} severity · {f.status.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: "var(--text-hint)" }}>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <Link
          to="/notifications"
          onClick={() => setOpen(false)}
          className="flex items-center justify-between px-4 py-2.5 text-[12px] font-medium hover:bg-[color:var(--surface)]"
          style={{ color: "var(--brown-800)" }}
        >
          View all {openCount > 0 ? `(${openCount} open)` : "notifications"}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </PopoverContent>
    </Popover>
  );
}

function UserPopover() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const initials = getUserInitials(user ?? undefined);
  const displayName = getUserDisplayName(user ?? undefined);
  const email = user?.email ?? "";

  const handleSignOut = () => {
    clearAuth();
    navigate({ to: "/" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition-shadow hover:shadow-md focus:outline-none focus:ring-2"
          style={{ backgroundColor: "var(--brown-800)", color: "#fff", boxShadow: "0 0 0 2px var(--cream)" }}
          aria-label="Account"
        >
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[260px] p-0 overflow-hidden"
        style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" }}
      >
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "var(--brown-800)", color: "#fff" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold" style={{ color: "var(--brown-800)" }}>{displayName}</p>
            <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>{email}</p>
          </div>
        </div>
        <div className="py-1.5">
          <MenuItem icon={UserCircle2} label="Profile" to="/users" />
          <MenuItem icon={SettingsIcon} label="Settings" to="/settings" />
          <MenuItem icon={Bell} label="Inbox" to="/notifications" />
        </div>
        <div className="border-t py-1.5" style={{ borderColor: "var(--border-subtle)" }}>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] hover:bg-[color:var(--surface)]"
            style={{ color: "var(--destructive)" }}
          >
            <LogOut className="h-[14px] w-[14px]" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MenuItem({ icon: Icon, label, to }: { icon: typeof User; label: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 px-4 py-2 text-[13px] hover:bg-[color:var(--surface)]"
      style={{ color: "var(--brown-800)" }}
    >
      <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const { collapsed, toggle } = useSidebarState();
  const active = findActive(location.pathname);

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)] text-foreground">
      <OrbitalSidebar collapsed={collapsed} onToggle={toggle} />

      <main className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-white/90 px-4 backdrop-blur md:px-6"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex min-w-0 items-center gap-2">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white md:hidden"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
                  aria-label="Open menu"
                >
                  <Menu className="h-[16px] w-[16px]" strokeWidth={1.75} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 border-0" style={{ backgroundColor: "var(--brown-800)" }}>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <MobileNav pathname={location.pathname} />
              </SheetContent>
            </Sheet>

            <div className="hidden min-w-0 items-center gap-2 text-[13px] sm:flex">
              <span style={{ color: "var(--text-muted)" }}>{active?.section.label ?? "Auditly"}</span>
              <span style={{ color: "var(--text-hint)" }}>/</span>
              <span className="font-medium truncate" style={{ color: "var(--brown-800)" }}>
                {active?.item.label ?? "Overview"}
              </span>
            </div>
            <span className="font-medium text-[13px] truncate sm:hidden" style={{ color: "var(--brown-800)" }}>
              {active?.item.label ?? "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div
              className="hidden h-9 w-72 items-center gap-2 rounded-lg border bg-[color:var(--surface)] px-3 text-[13px] lg:flex"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-hint)" }}
            >
              <Search className="h-[14px] w-[14px]" strokeWidth={1.75} />
              <span className="flex-1 truncate">Search audits, findings, vendors…</span>
              <kbd
                className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
              >⌘K</kbd>
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white lg:hidden"
              style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
              aria-label="Search"
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={1.75} />
            </button>
            <NotificationsPopover />
            <UserPopover />
          </div>
        </header>

        <div className="flex-1 bg-dot-grid">
          <div className="mx-auto max-w-[1280px] p-4 md:p-6 fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const { unreadCount, openCount } = useNavBadges();

  const badgeFor = (to: string): number | undefined => {
    if (to === "/notifications") return unreadCount > 0 ? unreadCount : undefined;
    if (to === "/findings") return openCount > 0 ? openCount : undefined;
    return undefined;
  };

  return (
    <nav className="scrollbar-thin flex h-full flex-col overflow-y-auto bg-linen px-3 py-4">
      <div className="flex items-center gap-2.5 px-3 pb-4">
        <LogoIcon size={24} className="shrink-0" />
        <span className="text-[15px] font-semibold tracking-tight text-white font-display">Auditly</span>
      </div>
      {NAV_SECTIONS.map((section, idx) => (
        <div key={section.id} className={cn(idx > 0 && "mt-4")}>
          <div className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase" style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }}>
            {section.label}
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              const badge = badgeFor(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors",
                      isActive ? "text-white" : "text-white/65 hover:bg-white/[0.08] hover:text-white",
                    )}
                    style={isActive ? { backgroundColor: "var(--brown-600)" } : undefined}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge != null && (
                      <span
                        className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
                        style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
