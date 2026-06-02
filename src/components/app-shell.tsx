import * as React from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { Search, Bell, AlertOctagon, ClipboardList, FileBarChart, Settings as SettingsIcon, User, LogOut, UserCircle2, ChevronRight, Menu } from "lucide-react";
import { OrbitalSidebar, NAV_SECTIONS, useSidebarState } from "@/components/orbital-sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NOTIFICATIONS } from "@/lib/audit-data";
import { cn } from "@/lib/utils";

function findActive(pathname: string) {
  for (const s of NAV_SECTIONS) {
    for (const it of s.items) {
      if (pathname === it.to || pathname.startsWith(it.to + "/")) return { section: s, item: it };
    }
  }
  return null;
}

const KIND_ICON = {
  finding: AlertOctagon,
  audit: ClipboardList,
  report: FileBarChart,
  system: SettingsIcon,
} as const;

function NotificationsPopover() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-[color:var(--brown-50)]"
          style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
          aria-label="Notifications"
        >
          <Bell className="h-[16px] w-[16px]" strokeWidth={1.75} />
          {unread > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white"
              style={{ backgroundColor: "var(--brown-800)" }}
            >
              {unread > 9 ? "9+" : unread}
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
          <button className="text-[11px] font-medium hover:underline" style={{ color: "var(--brown-600)" }}>
            Mark all read
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
          {NOTIFICATIONS.slice(0, 6).map((n) => {
            const Icon = KIND_ICON[n.kind];
            return (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 border-b px-4 py-3 transition-colors hover:bg-[color:var(--surface)] cursor-pointer",
                  n.unread && "bg-[color:var(--cream)]",
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
                      {n.title}
                    </p>
                    {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--brown-800)" }} />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {n.body}
                  </p>
                  <p className="mt-1 text-[10px]" style={{ color: "var(--text-hint)" }}>{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          to="/notifications"
          className="flex items-center justify-between px-4 py-2.5 text-[12px] font-medium hover:bg-[color:var(--surface)]"
          style={{ color: "var(--brown-800)" }}
        >
          View all notifications
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </PopoverContent>
    </Popover>
  );
}

function UserPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition-shadow hover:shadow-md focus:outline-none focus:ring-2"
          style={{ backgroundColor: "var(--brown-800)", color: "#fff", boxShadow: "0 0 0 2px var(--cream)" }}
          aria-label="Account"
        >
          SC
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
            SC
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold" style={{ color: "var(--brown-800)" }}>Sarah Chen</p>
            <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>sarah@auditly.io</p>
          </div>
        </div>
        <div className="py-1.5">
          <MenuItem icon={UserCircle2} label="Profile" to="/users" />
          <MenuItem icon={SettingsIcon} label="Settings" to="/settings" />
          <MenuItem icon={Bell} label="Inbox" to="/notifications" />
        </div>
        <div className="border-t py-1.5" style={{ borderColor: "var(--border-subtle)" }}>
          <button
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
          className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-white/90 px-6 backdrop-blur"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            <span style={{ color: "var(--text-muted)" }}>{active?.section.label ?? "Auditly"}</span>
            <span style={{ color: "var(--text-hint)" }}>/</span>
            <span className="font-medium" style={{ color: "var(--brown-800)" }}>
              {active?.item.label ?? "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
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
            <NotificationsPopover />
            <UserPopover />
          </div>
        </header>

        <div className="flex-1 bg-dot-grid">
          <div className="mx-auto max-w-[1280px] p-6 fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
