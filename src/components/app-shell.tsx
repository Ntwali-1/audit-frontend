import * as React from "react";
import { useRouterState } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";
import { ShaderBackground } from "@/components/shader-background";
import { OrbitalSidebar, NAV_SECTIONS, useSidebarState } from "@/components/orbital-sidebar";

function useClock() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

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
  const now = useClock();
  const { collapsed, toggle } = useSidebarState();
  const active = findActive(location.pathname);

  return (
    <div className="relative flex min-h-screen text-foreground">
      {/* Ambient shader background — every page */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <ShaderBackground variant="warm" />
        <div className="absolute inset-0 bg-background/60" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        {/* Aurora blobs */}
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <OrbitalSidebar collapsed={collapsed} onToggle={toggle} />

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-background/40 px-6 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>{active?.section.label ?? "Auditly"}</span>
                <span className="text-border">/</span>
                <span className="text-foreground/80">{active?.item.label ?? "Overview"}</span>
              </div>
              <h1 className="truncate text-base font-semibold tracking-tight">
                {active?.item.label ?? "Auditly"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground shadow-inner lg:flex w-72">
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 truncate">Search audits, findings, vendors…</span>
              <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">⌘K</kbd>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-mono">{now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 transition-colors hover:bg-accent">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Lead Auditor</p>
            </div>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold ring-2 ring-background">
              SC
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 p-6 duration-500">{children}</div>

        <footer className="border-t border-border/40 px-6 py-4 text-[11px] text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Crafted in-house · all data is local to this browser session</span>
            <span className="font-mono">build · {now.toISOString().slice(0, 10)}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
