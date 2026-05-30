import * as React from "react";
import { useRouterState } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";
import { OrbitalSidebar, NAV_SECTIONS, useSidebarState } from "@/components/orbital-sidebar";

function findActive(pathname: string) {
  for (const s of NAV_SECTIONS) {
    for (const it of s.items) {
      if (pathname === it.to || pathname.startsWith(it.to + "/")) return { section: s, item: it };
    }
  }
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const { collapsed, toggle } = useSidebarState();
  const active = findActive(location.pathname);

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)] text-foreground">
      <OrbitalSidebar collapsed={collapsed} onToggle={toggle} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Topbar — 56px */}
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
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-[color:var(--brown-50)]"
              style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
            >
              <Bell className="h-[16px] w-[16px]" strokeWidth={1.75} />
              <span
                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: "var(--brown-400)" }}
              />
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold"
              style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
            >
              SC
            </div>
          </div>
        </header>

        {/* Content with dot-grid background */}
        <div className="flex-1 bg-dot-grid">
          <div className="mx-auto max-w-[1280px] p-6 fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
