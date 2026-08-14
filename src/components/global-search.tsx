import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertOctagon, Building2, ClipboardList, CornerDownLeft, Search, UserRound, UsersRound,
} from "lucide-react";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useNavSections } from "@/components/orbital-sidebar";
import { useAuth } from "@/lib/auth-context";
import {
  auditsApi, findingsApi, teamsApi, usersApi,
  AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName,
} from "@/lib/api";
import { ORG_TYPE_LABEL, platformApi } from "@/lib/api-portals";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Open/close, shared by the header button and the ⌘K shortcut                 */
/* -------------------------------------------------------------------------- */

const SearchContext = React.createContext<{ open: () => void } | null>(null);

/** Lets any button anywhere in the shell raise the palette. */
export function useGlobalSearch() {
  const ctx = React.useContext(SearchContext);
  return ctx ?? { open: () => {} };
}

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = React.useMemo(() => ({ open: () => setIsOpen(true) }), []);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <GlobalSearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* The palette                                                                */
/* -------------------------------------------------------------------------- */

type Hit = {
  id: string;
  /* Everything cmdk should match against, flattened into one string. */
  keywords: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  go: () => void;
};

function GlobalSearchDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { user, portal } = useAuth();
  const navSections = useNavSections();
  const [term, setTerm] = React.useState("");

  /* A fresh query each time it opens — a palette that remembers is a palette
     that shows yesterday's results. */
  React.useEffect(() => { if (open) setTerm(""); }, [open]);

  const isAdmin = user?.role === "ADMIN";
  const isManager = isAdmin || user?.role === "AUDIT_MANAGER";
  const isInstitution = portal === "INSTITUTION";
  const isPlatformAdmin = !!user?.isPlatformAdmin;

  /*
   * Nothing is fetched until the palette is first opened, and each source is
   * gated on the same permission that gates its page — asking for a list the
   * signed-in role cannot read would only produce a 403 nobody sees.
   */
  const audits = useQuery({
    queryKey: ["audits", "list", "search"],
    queryFn: () => auditsApi.getAll({ take: 200 }),
    enabled: open && isInstitution && isManager,
    staleTime: 60_000,
    retry: false,
  });
  const findings = useQuery({
    queryKey: ["findings", "search"],
    queryFn: () => findingsApi.getAll({ take: 300 }),
    enabled: open && isInstitution,
    staleTime: 60_000,
    retry: false,
  });
  const teams = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getAll(),
    enabled: open && isInstitution && isManager,
    staleTime: 60_000,
    retry: false,
  });
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    enabled: open && isAdmin,
    staleTime: 60_000,
    retry: false,
  });
  const organizations = useQuery({
    queryKey: ["platform", "organizations"],
    queryFn: () => platformApi.organizations(),
    enabled: open && isPlatformAdmin,
    staleTime: 60_000,
    retry: false,
  });

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  const run = React.useCallback((go: () => void) => { close(); go(); }, [close]);

  /* ---- hits ------------------------------------------------------------- */

  const pages: Hit[] = React.useMemo(
    () =>
      navSections.flatMap((section) =>
        section.items.map((item) => ({
          id: `page:${item.to}`,
          keywords: `${item.label} ${section.label} ${item.to}`,
          title: item.label,
          subtitle: section.label,
          icon: item.icon,
          go: () => navigate({ to: item.to }),
        })),
      ),
    [navSections, navigate],
  );

  const auditHits: Hit[] = React.useMemo(
    () =>
      (audits.data?.data ?? []).map((a) => ({
        id: `audit:${a.id}`,
        keywords: `${a.title} ${a.type ?? ""} ${a.scope ?? ""} ${a.team?.name ?? ""} ${AUDIT_STATUS_LABEL[a.status] ?? a.status}`,
        title: a.title,
        subtitle: `${AUDIT_STATUS_LABEL[a.status] ?? a.status}${a.team?.name ? ` · ${a.team.name}` : ""}${a.type ? ` · ${a.type}` : ""}`,
        icon: ClipboardList,
        go: () => navigate({ to: "/audits/$id", params: { id: a.id } }),
      })),
    [audits.data, navigate],
  );

  const findingHits: Hit[] = React.useMemo(
    () =>
      (findings.data?.data ?? []).map((f) => ({
        id: `finding:${f.id}`,
        keywords: `${f.title} ${f.description ?? ""} ${SEVERITY_LABEL[f.severity] ?? f.severity} ${FINDING_STATUS_LABEL[f.status] ?? f.status}`,
        title: f.title,
        subtitle: `${SEVERITY_LABEL[f.severity] ?? f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}`,
        icon: AlertOctagon,
        /* Findings live inside their audit, which is where acting on one happens. */
        go: () => navigate({ to: "/audits/$id", params: { id: f.auditId } }),
      })),
    [findings.data, navigate],
  );

  const teamHits: Hit[] = React.useMemo(
    () =>
      (teams.data ?? []).map((t) => ({
        id: `team:${t.id}`,
        keywords: `${t.name} ${t.description ?? ""} team`,
        title: t.name,
        subtitle: `${t._count?.members ?? t.members?.length ?? 0} members`,
        icon: UsersRound,
        go: () => navigate({ to: "/teams" }),
      })),
    [teams.data, navigate],
  );

  const userHits: Hit[] = React.useMemo(
    () =>
      (users.data?.data ?? []).map((u) => ({
        id: `user:${u.id}`,
        keywords: `${getUserDisplayName(u)} ${u.email} ${u.role ?? ""}`,
        title: getUserDisplayName(u),
        subtitle: `${u.email}${u.role ? ` · ${u.role.replace(/_/g, " ").toLowerCase()}` : ""}`,
        icon: UserRound,
        go: () => navigate({ to: "/users" }),
      })),
    [users.data, navigate],
  );

  const orgHits: Hit[] = React.useMemo(
    () =>
      (organizations.data ?? []).map((o) => ({
        id: `org:${o.id}`,
        keywords: `${o.name} ${ORG_TYPE_LABEL[o.type] ?? o.type} ${o.district ?? ""} institution organization`,
        title: o.name,
        subtitle: `${ORG_TYPE_LABEL[o.type] ?? o.type}${o.district ? ` · ${o.district}` : ""}`,
        icon: Building2,
        go: () => navigate({ to: "/platform/$id", params: { id: o.id } }),
      })),
    [organizations.data, navigate],
  );

  const loading =
    audits.isFetching || findings.isFetching || teams.isFetching ||
    users.isFetching || organizations.isFetching;

  const searching = term.trim().length > 0;

  /*
   * With no query typed, the palette is a launcher, not a dump of everything
   * the account can see — so pages lead and each record group shows only a
   * handful. Once something is typed, every match is available.
   */
  const groups: Array<{ heading: string; hits: Hit[] }> = (
    searching
      ? [
          { heading: "Institutions", hits: orgHits },
          { heading: "Audits", hits: auditHits },
          { heading: "Findings", hits: findingHits },
          { heading: "People", hits: userHits },
          { heading: "Teams", hits: teamHits },
          { heading: "Go to", hits: pages },
        ]
      : [
          { heading: "Go to", hits: pages },
          { heading: "Recent audits", hits: auditHits.slice(0, 4) },
          { heading: "Institutions", hits: orgHits.slice(0, 4) },
        ]
  ).filter((g) => g.hits.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        /* The dialog's own close button would land on top of the input. */
        className="overflow-hidden p-0 sm:max-w-[560px] [&>button]:hidden"
        style={{ borderColor: "var(--border-default)", boxShadow: "var(--shadow-modal)" }}
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command
          /* cmdk matches on the item's own value, which we set to the flattened
             keyword string, so a finding is findable by its severity too. */
          filter={(value, search) =>
            value.toLowerCase().includes(search.toLowerCase().trim()) ? 1 : 0
          }
        >
          <CommandInput
            value={term}
            onValueChange={setTerm}
            placeholder="Search audits, findings, people, teams…"
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              {loading ? "Searching…" : "Nothing matches that."}
            </CommandEmpty>

            {groups.map((group) => (
              <CommandGroup key={group.heading} heading={group.heading}>
                {group.hits.slice(0, 20).map((hit) => (
                  <CommandItem
                    key={hit.id}
                    value={`${hit.keywords} ${hit.id}`}
                    onSelect={() => run(hit.go)}
                    className="gap-2.5"
                  >
                    <hit.icon
                      className="h-[15px] w-[15px] shrink-0"
                      strokeWidth={1.75}
                      style={{ color: "var(--text-hint)" }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]" style={{ color: "var(--brown-800)" }}>
                        {hit.title}
                      </span>
                      {hit.subtitle && (
                        <span className="block truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {hit.subtitle}
                        </span>
                      )}
                    </span>
                    <CornerDownLeft
                      className="h-3 w-3 shrink-0 opacity-0 aria-selected:opacity-60"
                      style={{ color: "var(--text-hint)" }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>

          <div
            className="flex items-center justify-between border-t px-3 py-2 text-[11px]"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-hint)" }}
          >
            <span className="flex items-center gap-1.5">
              <Search className="h-3 w-3" /> Everything you have access to
            </span>
            <span className="flex items-center gap-2">
              <Kbd>↑↓</Kbd> navigate <Kbd>↵</Kbd> open <Kbd>esc</Kbd> close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="rounded px-1 py-0.5 font-mono text-[10px]"
      style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
    >
      {children}
    </kbd>
  );
}

/* -------------------------------------------------------------------------- */
/* The header control                                                         */
/* -------------------------------------------------------------------------- */

/** The wide search field in the header. Opens the palette; never types inline. */
export function SearchTrigger({ className }: { className?: string }) {
  const { open } = useGlobalSearch();
  return (
    <button
      onClick={open}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border bg-[color:var(--surface)] px-3 text-[13px] transition-colors hover:bg-white",
        className,
      )}
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-hint)" }}
    >
      <Search className="h-[14px] w-[14px]" strokeWidth={1.75} />
      <span className="flex-1 truncate text-left">Search audits, findings, teams…</span>
      <kbd
        className="rounded px-1.5 py-0.5 font-mono text-[10px]"
        style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
      >
        ⌘K
      </kbd>
    </button>
  );
}

/** The icon-only version, for narrow viewports. */
export function SearchIconButton({ className }: { className?: string }) {
  const { open } = useGlobalSearch();
  return (
    <button
      onClick={open}
      className={cn("flex h-9 w-9 items-center justify-center rounded-lg border bg-white", className)}
      style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
      aria-label="Search"
    >
      <Search className="h-[16px] w-[16px]" strokeWidth={1.75} />
    </button>
  );
}
