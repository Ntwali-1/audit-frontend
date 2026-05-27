import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, FileBarChart, Settings, LogOut, ShieldCheck } from "lucide-react";
import { ShaderBackground } from "@/components/shader-background";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/audits", label: "Audits", icon: ClipboardList },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      {/* Ambient shader background */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <ShaderBackground variant="subtle" />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" />
      </div>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-md md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="font-semibold tracking-tight text-sidebar-foreground">Auditly</div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
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
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/60 px-6 backdrop-blur-md">
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              {nav.find((n) => location.pathname.startsWith(n.to))?.label ?? "Auditly"}
            </h1>
            <p className="text-xs text-muted-foreground">Frontend demo · all data is local</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">Sarah Chen</p>
              <p className="text-xs text-muted-foreground">Lead Auditor</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
              SC
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
