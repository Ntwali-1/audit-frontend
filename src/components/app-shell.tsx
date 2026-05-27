import * as React from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, FileBarChart, Settings, LogOut, ShieldCheck, Command } from "lucide-react";
import { ShaderBackground } from "@/components/shader-background";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/audits", label: "Audits", icon: ClipboardList },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

function useClock() {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const now = useClock();
  const active = nav.find((n) => location.pathname.startsWith(n.to));

  return (
    <div className="relative flex min-h-screen text-foreground">
      {/* Ambient shader background — visible on every page */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <ShaderBackground variant="warm" />
        {/* Soft veil so content stays legible without hiding the shader */}
        <div className="absolute inset-0 bg-background/55" />
        {/* Hand-crafted grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border/60 bg-sidebar/60 backdrop-blur-xl md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border/60 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-sidebar-foreground">Auditly</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">v0.4 · demo</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                )}
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-sidebar-border/60 p-3">
          <div className="flex items-center justify-between rounded-md border border-dashed border-border/70 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Command className="h-3 w-3" />Quick search</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">⌘ K</kbd>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/40 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-semibold tracking-tight">{active?.label ?? "Auditly"}</h1>
              <p className="text-xs text-muted-foreground">
                {now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} ·{" "}
                {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Workspace live
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Lead Auditor</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold ring-2 ring-background">
              SC
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
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
