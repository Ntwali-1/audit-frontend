import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as useRouterState, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getUserInitials, g as getUserDisplayName, c as cn, f as findingsApi } from "./api-_p3LF9GJ.mjs";
import { u as useAuth, c as useBrandMark } from "./router-CdOLPATR.mjs";
import { R as Root2, T as Trigger$1, P as Portal$1, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { R as Root, T as Trigger, P as Portal, C as Content, a as Close, b as Title, O as Overlay, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { a2 as Menu, d as Search, a3 as LayoutDashboard, V as ChartPie, E as Bell, J as ClipboardList, z as ClipboardCheck, O as OctagonAlert, p as FileChartColumnIncreasing, a as Users, f as UsersRound, l as Send, _ as Briefcase, y as Inbox, Y as Earth, N as Sparkles, a4 as Settings, B as Building2, a5 as ChevronsRight, a6 as ChevronsLeft, a7 as ChevronDown, a8 as LogOut, X, G as ChevronRight, a9 as CircleUserRound } from "../_libs/lucide-react.mjs";
const NAV_SECTIONS = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics", icon: ChartPie, managerOnly: true },
      { to: "/notifications", label: "Inbox", icon: Bell }
    ]
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { to: "/audits", label: "Audits", icon: ClipboardList, managerOnly: true },
      { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck, auditorOnly: true },
      { to: "/findings", label: "Findings", icon: OctagonAlert },
      { to: "/reports", label: "Reports", icon: FileChartColumnIncreasing, managerOnly: true }
    ]
  },
  {
    id: "directory",
    label: "Directory",
    items: [
      { to: "/users", label: "Users", icon: Users, adminOnly: true },
      { to: "/teams", label: "Teams", icon: UsersRound, managerOnly: true }
    ]
  },
  {
    id: "statutory",
    label: "Statutory reporting",
    portals: ["INSTITUTION"],
    // Public bodies only — a private organization owes nothing to OAG or OCIA,
    // so the section is not just empty for them, it is meaningless.
    publicOnly: true,
    items: [{ to: "/submissions", label: "Submissions", icon: Send }]
  },
  // -- OAG portal ------------------------------------------------------------
  {
    id: "oag",
    label: "External audit",
    portals: ["OAG"],
    items: [
      { to: "/oag/engagements", label: "Engagements", icon: Briefcase },
      { to: "/oag/findings", label: "External findings", icon: OctagonAlert },
      { to: "/oag/submissions", label: "Filings received", icon: Inbox }
    ]
  },
  // -- OCIA portal -----------------------------------------------------------
  {
    id: "ocia",
    label: "Oversight",
    portals: ["OCIA"],
    items: [
      { to: "/ocia", label: "National overview", icon: Earth },
      { to: "/ocia/compliance", label: "Compliance", icon: ClipboardCheck },
      { to: "/ocia/submissions", label: "Filings received", icon: Inbox }
    ]
  },
  {
    id: "intel",
    label: "Intelligence",
    items: [
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/settings", label: "Settings", icon: Settings }
    ]
  },
  // Shown only to platform operators, whatever portal they sit in.
  {
    id: "platform",
    label: "Platform",
    items: [{ to: "/platform", label: "Institutions", icon: Building2 }]
  }
];
const SEEN_KEY = "auditly:seen_findings";
const SEEN_EVENT = "auditly:seen-changed";
function getSeenIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(JSON.parse(raw || "[]"));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function persistSeen(ids) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(SEEN_EVENT));
  } catch {
  }
}
function markAllSeen(ids) {
  persistSeen(ids);
}
function markOneSeen(id) {
  const seen = getSeenIds();
  if (!seen.has(id)) {
    seen.add(id);
    persistSeen(Array.from(seen));
  }
}
function useNavBadges() {
  const { data: openFindings } = useQuery({
    queryKey: ["findings", "open"],
    queryFn: () => findingsApi.getAll({ status: "OPEN", take: 100 }),
    staleTime: 3e4
  });
  const [seenIds, setSeenIds] = reactExports.useState(() => getSeenIds());
  reactExports.useEffect(() => {
    const handler = () => setSeenIds(getSeenIds());
    window.addEventListener(SEEN_EVENT, handler);
    return () => window.removeEventListener(SEEN_EVENT, handler);
  }, []);
  const openCount = openFindings?.total ?? 0;
  const findings = openFindings?.data ?? [];
  const unreadCount = findings.filter((f) => !seenIds.has(f.id)).length;
  return { openCount, unreadCount, findings, seenIds };
}
const SHARED_SECTIONS = /* @__PURE__ */ new Set(["intel"]);
function useNavSections() {
  const { user, portal } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const isAuditor = user?.role === "AUDITOR" || user?.role === "LEAD_AUDITOR";
  const isPlatformAdmin = !!user?.isPlatformAdmin;
  return NAV_SECTIONS.filter((s) => {
    if (s.id === "platform") return isPlatformAdmin;
    if (SHARED_SECTIONS.has(s.id)) return true;
    if (s.publicOnly && user?.organizationType === "PRIVATE_COMPANY") return false;
    const portals = s.portals ?? ["INSTITUTION"];
    return portals.includes(portal);
  }).map((s) => ({
    ...s,
    items: s.items.filter((i) => {
      if (i.adminOnly && !isAdmin) return false;
      if (i.managerOnly && !isManager) return false;
      if (i.auditorOnly && !isAuditor) return false;
      return true;
    })
  })).filter((s) => s.items.length > 0);
}
const STORAGE_KEY = "auditly:sidebar:collapsed";
function useSidebarState() {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
    }
  }, [collapsed]);
  return { collapsed, toggle: () => setCollapsed((c) => !c), setCollapsed };
}
function OrbitalSidebar({
  collapsed,
  onToggle
}) {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const { user, clearAuth, isLoading } = useAuth();
  const { openCount, unreadCount } = useNavBadges();
  const navSections = useNavSections();
  const brand = useBrandMark();
  const organizationName = user?.organizationName ?? null;
  const badgeFor = (to) => {
    if (to === "/notifications") return unreadCount > 0 ? unreadCount : void 0;
    if (to === "/findings") return openCount > 0 ? openCount : void 0;
    return void 0;
  };
  const handleSignOut = () => {
    clearAuth();
    navigate({ to: "/" });
  };
  const initials = isLoading && !user ? "" : getUserInitials(user ?? void 0);
  const displayName = isLoading && !user ? "" : getUserDisplayName(user ?? void 0);
  const roleLabel = user?.role ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      "data-collapsed": collapsed,
      className: cn(
        "relative hidden shrink-0 flex-col bg-linen transition-[width] duration-300 ease-out md:flex",
        collapsed ? "md:w-[64px]" : "md:w-[256px]"
      ),
      style: { backgroundColor: "var(--brown-800)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onToggle,
            "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
            className: "absolute -right-3 top-7 z-30 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-[color:var(--brown-600)] shadow-md hover:bg-[color:var(--brown-50)]",
            style: { borderColor: "var(--border-default)" },
            children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsLeft, { className: "h-3 w-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "flex h-16 items-center gap-3 px-4 border-b",
              collapsed && "justify-center px-0"
            ),
            style: { borderColor: "rgba(255,255,255,0.08)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex min-w-0 items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/95", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: brand.src, alt: brand.alt, className: "h-6 w-6 object-contain" }) }),
              !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-[15px] font-semibold leading-tight tracking-tight text-white font-display", children: "Auditly" }),
                organizationName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block truncate text-[11px] leading-tight",
                    style: { color: "rgba(255,255,255,0.45)" },
                    children: organizationName
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "scrollbar-thin flex-1 overflow-y-auto px-3 py-4", children: navSections.map((section, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(idx > 0 && "mt-4"), children: [
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-3 pb-2 pt-1 text-[10px] font-medium uppercase",
              style: { letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" },
              children: section.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: section.items.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            const badge = badgeFor(item.to);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: item.to,
                title: collapsed ? item.label : void 0,
                className: cn(
                  "group relative flex h-11 items-center rounded-lg px-3 text-[14px] font-medium transition-all duration-150",
                  collapsed && "justify-center px-0",
                  isActive ? "text-white" : "text-white/65 hover:translate-x-0.5 hover:bg-white/[0.08] hover:text-white"
                ),
                style: isActive ? { backgroundColor: "var(--brown-600)" } : void 0,
                children: [
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      "aria-hidden": true,
                      className: "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full",
                      style: { backgroundColor: "var(--brown-200)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-[18px] w-[18px] shrink-0", !collapsed && "mr-3"), strokeWidth: 1.75 }),
                  !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: item.label }),
                    badge != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                        style: { backgroundColor: "var(--brown-200)", color: "var(--brown-800)" },
                        children: badge > 99 ? "99+" : badge
                      }
                    )
                  ] }),
                  collapsed && badge != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute right-1 top-1 h-1.5 w-1.5 rounded-full",
                      style: { backgroundColor: "var(--brown-200)" }
                    }
                  )
                ]
              }
            ) }, item.to);
          }) })
        ] }, section.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn("border-t p-3", collapsed && "flex justify-center"),
            style: { borderColor: "rgba(255,255,255,0.08)" },
            children: [
              collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => navigate({ to: "/settings" }),
                  className: "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold",
                  style: { backgroundColor: "var(--brown-200)", color: "var(--brown-800)" },
                  children: initials
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => navigate({ to: "/settings" }),
                  className: "flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/[0.06]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                        style: { backgroundColor: "var(--brown-200)", color: "var(--brown-800)" },
                        children: initials
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] font-medium text-white/90", children: displayName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[11px] text-white/45", children: roleLabel })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-white/45" })
                  ]
                }
              ),
              !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: handleSignOut,
                  className: "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white/85",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-[16px] w-[16px]", strokeWidth: 1.75 }),
                    "Sign out"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const Popover = Root2;
const PopoverTrigger = Trigger$1;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
function findActive(pathname) {
  for (const s of NAV_SECTIONS) {
    for (const it of s.items) {
      if (pathname === it.to || pathname.startsWith(it.to + "/")) return { section: s, item: it };
    }
  }
  return null;
}
const SEVERITY_ICON = {
  CRITICAL: OctagonAlert,
  HIGH: OctagonAlert,
  MEDIUM: ClipboardList,
  LOW: FileChartColumnIncreasing
};
function NotificationsPopover() {
  const { unreadCount, findings, openCount, seenIds } = useNavBadges();
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllSeen(findings.map((f) => f.id));
  };
  const handleClick = (auditId, findingId) => {
    markOneSeen(findingId);
    setOpen(false);
    navigate({ to: "/audits/$id", params: { id: auditId } });
  };
  const displayFindings = findings.slice(0, 6);
  const unread = displayFindings.filter((f) => !seenIds.has(f.id)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "relative flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-[color:var(--brown-50)]",
        style: { borderColor: "var(--border-subtle)", color: "var(--brown-600)" },
        "aria-label": "Notifications",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-[16px] w-[16px]", strokeWidth: 1.75 }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white",
              style: { backgroundColor: "var(--brown-800)" },
              children: unreadCount > 9 ? "9+" : unreadCount
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        align: "end",
        sideOffset: 10,
        className: "w-[380px] p-0 overflow-hidden",
        style: { borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b px-4 py-3", style: { borderColor: "var(--border-subtle)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", style: { color: "var(--brown-800)" }, children: "Notifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: { color: "var(--text-muted)" }, children: [
                unread,
                " unread"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleMarkAllRead,
                className: "text-[11px] font-medium hover:underline",
                style: { color: "var(--brown-600)" },
                children: "Mark all read"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[360px] overflow-y-auto scrollbar-thin", children: [
            displayFindings.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 text-center text-[13px]", style: { color: "var(--text-muted)" }, children: "No open findings right now." }),
            displayFindings.map((f) => {
              const isUnread = !seenIds.has(f.id);
              const Icon = SEVERITY_ICON[f.severity] ?? OctagonAlert;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleClick(f.auditId, f.id),
                  className: cn(
                    "flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-[color:var(--surface)]",
                    isUnread && "bg-[color:var(--cream)]"
                  ),
                  style: { borderColor: "var(--border-subtle)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                        style: { backgroundColor: "var(--brown-50)", color: "var(--brown-800)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[14px] w-[14px]", strokeWidth: 1.75 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium", style: { color: "var(--brown-800)" }, children: f.title }),
                        isUnread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full", style: { backgroundColor: "var(--brown-800)" } })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 line-clamp-2 text-[12px]", style: { color: "var(--text-muted)" }, children: [
                        f.severity,
                        " severity · ",
                        f.status.replace(/_/g, " ")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px]", style: { color: "var(--text-hint)" }, children: new Date(f.createdAt).toLocaleDateString() })
                    ] })
                  ]
                },
                f.id
              );
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/notifications",
              onClick: () => setOpen(false),
              className: "flex items-center justify-between px-4 py-2.5 text-[12px] font-medium hover:bg-[color:var(--surface)]",
              style: { color: "var(--brown-800)" },
              children: [
                "View all ",
                openCount > 0 ? `(${openCount} open)` : "notifications",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function UserPopover() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const initials = getUserInitials(user ?? void 0);
  const displayName = getUserDisplayName(user ?? void 0);
  const email = user?.email ?? "";
  const handleSignOut = () => {
    clearAuth();
    navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition-shadow hover:shadow-md focus:outline-none focus:ring-2",
        style: { backgroundColor: "var(--brown-800)", color: "#fff", boxShadow: "0 0 0 2px var(--cream)" },
        "aria-label": "Account",
        children: initials
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        align: "end",
        sideOffset: 10,
        className: "w-[260px] p-0 overflow-hidden",
        style: { borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b px-4 py-3", style: { borderColor: "var(--border-subtle)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold",
                style: { backgroundColor: "var(--brown-800)", color: "#fff" },
                children: initials
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-sm font-semibold", style: { color: "var(--brown-800)" }, children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px]", style: { color: "var(--text-muted)" }, children: email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: CircleUserRound, label: "Profile", to: "/users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Settings, label: "Settings", to: "/settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { icon: Bell, label: "Inbox", to: "/notifications" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t py-1.5", style: { borderColor: "var(--border-subtle)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleSignOut,
              className: "flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] hover:bg-[color:var(--surface)]",
              style: { color: "var(--destructive)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-[14px] w-[14px]", strokeWidth: 1.75 }),
                "Sign out"
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function MenuItem({ icon: Icon, label, to }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: "flex items-center gap-2.5 px-4 py-2 text-[13px] hover:bg-[color:var(--surface)]",
      style: { color: "var(--brown-800)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[14px] w-[14px]", strokeWidth: 1.75 }),
        label
      ]
    }
  );
}
function AppShell({ children }) {
  const { location } = useRouterState();
  const { collapsed, toggle } = useSidebarState();
  const active = findActive(location.pathname);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-[color:var(--cream)] text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrbitalSidebar, { collapsed, onToggle: toggle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "header",
        {
          className: "sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-white/90 px-4 backdrop-blur md:px-6",
          style: { borderColor: "var(--border-subtle)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "flex h-9 w-9 items-center justify-center rounded-lg border bg-white md:hidden",
                    style: { borderColor: "var(--border-subtle)", color: "var(--brown-600)" },
                    "aria-label": "Open menu",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-[16px] w-[16px]", strokeWidth: 1.75 })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "left", className: "w-[280px] p-0 border-0", style: { backgroundColor: "var(--brown-800)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "sr-only", children: "Navigation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, { pathname: location.pathname })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden min-w-0 items-center gap-2 text-[13px] sm:flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-muted)" }, children: active?.section.label ?? "Auditly" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-hint)" }, children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate", style: { color: "var(--brown-800)" }, children: active?.item.label ?? "Overview" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[13px] truncate sm:hidden", style: { color: "var(--brown-800)" }, children: active?.item.label ?? "Overview" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "hidden h-9 w-72 items-center gap-2 rounded-lg border bg-[color:var(--surface)] px-3 text-[13px] lg:flex",
                  style: { borderColor: "var(--border-subtle)", color: "var(--text-hint)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-[14px] w-[14px]", strokeWidth: 1.75 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: "Search audits, findings, teams…" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "kbd",
                      {
                        className: "rounded px-1.5 py-0.5 font-mono text-[10px]",
                        style: { backgroundColor: "var(--brown-50)", color: "var(--brown-600)" },
                        children: "⌘K"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "flex h-9 w-9 items-center justify-center rounded-lg border bg-white lg:hidden",
                  style: { borderColor: "var(--border-subtle)", color: "var(--brown-600)" },
                  "aria-label": "Search",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-[16px] w-[16px]", strokeWidth: 1.75 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsPopover, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPopover, {})
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-dot-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1280px] p-4 md:p-6 fade-in", children }) })
    ] })
  ] });
}
function MobileNav({ pathname }) {
  const { unreadCount, openCount } = useNavBadges();
  const navSections = useNavSections();
  const badgeFor = (to) => {
    if (to === "/notifications") return unreadCount > 0 ? unreadCount : void 0;
    if (to === "/findings") return openCount > 0 ? openCount : void 0;
    return void 0;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "scrollbar-thin flex h-full flex-col overflow-y-auto bg-linen px-3 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-4 text-[15px] font-semibold tracking-tight text-white font-display", children: "Auditly" }),
    navSections.map((section, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(idx > 0 && "mt-4"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2 pt-1 text-[10px] font-medium uppercase", style: { letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)" }, children: section.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: section.items.map((item) => {
        const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        const badge = badgeFor(item.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors",
              isActive ? "text-white" : "text-white/65 hover:bg-white/[0.08] hover:text-white"
            ),
            style: isActive ? { backgroundColor: "var(--brown-600)" } : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 1.75 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: item.label }),
              badge != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                  style: { backgroundColor: "var(--brown-200)", color: "var(--brown-800)" },
                  children: badge > 99 ? "99+" : badge
                }
              )
            ]
          }
        ) }, item.to);
      }) })
    ] }, section.id))
  ] });
}
export {
  AppShell as A,
  markAllSeen as a,
  getSeenIds as g,
  markOneSeen as m
};
