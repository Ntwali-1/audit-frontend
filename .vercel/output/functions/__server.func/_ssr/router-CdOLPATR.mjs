import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-Clwc8pRK.css";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const AuthContext = reactExports.createContext(null);
function readStoredSession() {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("auth_user");
    return { token, user: raw ? JSON.parse(raw) : null };
  } catch {
    return { token: null, user: null };
  }
}
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(() => readStoredSession());
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setSession(readStoredSession());
    setIsLoading(false);
  }, []);
  reactExports.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "access_token" || e.key === "auth_user") setSession(readStoredSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const setAuth = reactExports.useCallback(
    (accessToken, refreshToken, authUser) => {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(authUser));
      setSession({ token: accessToken, user: authUser });
      setIsLoading(false);
    },
    []
  );
  const clearAuth = reactExports.useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    setSession({ token: null, user: null });
    setIsLoading(false);
  }, []);
  const value = reactExports.useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isLoading,
      portal: session.user?.portalType ?? "INSTITUTION",
      setAuth,
      clearAuth
    }),
    [session, isLoading, setAuth, clearAuth]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
const PRODUCT_LOGO = "/logo.png";
const COAT_OF_ARMS = "/Coat_of_arms_of_Rwanda.svg";
function isPublicBody(type) {
  return type === "GOVERNMENT_DISTRICT" || type === "GOVERNMENT_INSTITUTION" || type === "OAG" || type === "OCIA";
}
function useBrandMark() {
  const { user } = useAuth();
  if (isPublicBody(user?.organizationType)) {
    return { src: COAT_OF_ARMS, alt: "Republic of Rwanda" };
  }
  return { src: PRODUCT_LOGO, alt: user?.organizationName ?? "Auditly" };
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$q = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Auditly" },
      { name: "description", content: "Audit Management Platform" }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
      },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$q.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) });
}
const $$splitComponentImporter$p = () => import("./users-Cd8jjwis.mjs");
const Route$p = createFileRoute("/users")({
  head: () => ({
    meta: [{
      title: "Users · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./teams-BGgRl6YB.mjs");
const Route$o = createFileRoute("/teams")({
  head: () => ({
    meta: [{
      title: "Teams · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./submissions-DBQtns2T.mjs");
const Route$n = createFileRoute("/submissions")({
  head: () => ({
    meta: [{
      title: "Submissions · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./settings-dsm8g4sA.mjs");
const Route$m = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./reports-CDE1GNW7.mjs");
const Route$l = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./register-BOs6UrM7.mjs");
const Route$k = createFileRoute("/register")({
  head: () => ({
    meta: [{
      title: "Register your institution · Auditly"
    }, {
      name: "description",
      content: "Bring your institution's internal audit programme onto Auditly."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./platform-5KAWl97r.mjs");
const Route$j = createFileRoute("/platform")({
  head: () => ({
    meta: [{
      title: "Platform · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./notifications-h31UNHlu.mjs");
const Route$i = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "Inbox · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./findings-DcOG_pBy.mjs");
const Route$h = createFileRoute("/findings")({
  head: () => ({
    meta: [{
      title: "Findings · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./dashboard-nwAkI6sg.mjs");
const Route$g = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./assistant-DIl-O8JL.mjs");
const Route$f = createFileRoute("/assistant")({
  head: () => ({
    meta: [{
      title: "AI Assistant · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./analytics-CGmoByDu.mjs");
const Route$e = createFileRoute("/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-BMxBDNdE.mjs");
const Route$d = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Sign in · Auditly"
    }, {
      name: "description",
      content: "Sign in to your Auditly audit management workspace."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./index-CYYe3aZd.mjs");
const Route$c = createFileRoute("/ocia/")({
  head: () => ({
    meta: [{
      title: "National overview · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./index-DhmZ1tjE.mjs");
const Route$b = createFileRoute("/evaluations/")({
  head: () => ({
    meta: [{
      title: "Evaluations · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-BbvjEGRs.mjs");
const Route$a = createFileRoute("/audits/")({
  head: () => ({
    meta: [{
      title: "Audits · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./submissions-D03llQ09.mjs");
const Route$9 = createFileRoute("/ocia/submissions")({
  head: () => ({
    meta: [{
      title: "Filings received · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./compliance-RgotohnB.mjs");
const Route$8 = createFileRoute("/ocia/compliance")({
  head: () => ({
    meta: [{
      title: "Compliance · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./submissions-C3sVaMzA.mjs");
const Route$7 = createFileRoute("/oag/submissions")({
  head: () => ({
    meta: [{
      title: "Filings received · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./findings-BsvBdYSL.mjs");
const Route$6 = createFileRoute("/oag/findings")({
  head: () => ({
    meta: [{
      title: "External findings · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./engagements-DmCZVxMu.mjs");
const Route$5 = createFileRoute("/oag/engagements")({
  head: () => ({
    meta: [{
      title: "Engagements · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_id-Cpv3HCX4.mjs");
const Route$4 = createFileRoute("/evaluations/$id")({
  head: () => ({
    meta: [{
      title: "Evaluation · Auditly"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./verify-email-sVv1PPir.mjs");
const Route$3 = createFileRoute("/auth/verify-email")({
  head: () => ({
    meta: [{
      title: "Verify your email · Auditly"
    }]
  }),
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function Shell({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-2xl border bg-white p-8 text-center", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: PRODUCT_LOGO, alt: "Auditly", className: "h-6 w-6 object-contain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15px] font-semibold", style: {
        color: "var(--brown-800)"
      }, children: "Auditly" })
    ] }),
    children
  ] }) });
}
function State({
  icon: Icon,
  tone,
  title,
  body
}) {
  const bg = tone === "good" ? "#E6F4ED" : "#FDECEC";
  const fg = tone === "good" ? "#1A6638" : "#9B2C2C";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-auto flex h-11 w-11 items-center justify-center rounded-2xl", style: {
      backgroundColor: bg
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5", style: {
      color: fg
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-[18px] font-semibold", style: {
      color: "var(--brown-800)"
    }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: body })
  ] });
}
const $$splitComponentImporter$2 = () => import("./reset-password-Do-S_czu.mjs");
const Route$2 = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [{
      title: "Reset your password · Auditly"
    }]
  }),
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_id-BPxQGiGr.mjs");
const Route$1 = createFileRoute("/audits/$id")({
  head: () => ({
    meta: [{
      title: `Audit Â· Auditly`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./accept-DL3TgnD4.mjs");
const Route = createFileRoute("/auth/invitations/accept")({
  head: () => ({
    meta: [{
      title: "Complete your profile · Auditly"
    }]
  }),
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : ""
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsersRoute = Route$p.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => Route$q
});
const TeamsRoute = Route$o.update({
  id: "/teams",
  path: "/teams",
  getParentRoute: () => Route$q
});
const SubmissionsRoute = Route$n.update({
  id: "/submissions",
  path: "/submissions",
  getParentRoute: () => Route$q
});
const SettingsRoute = Route$m.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$q
});
const ReportsRoute = Route$l.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$q
});
const RegisterRoute = Route$k.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$q
});
const PlatformRoute = Route$j.update({
  id: "/platform",
  path: "/platform",
  getParentRoute: () => Route$q
});
const NotificationsRoute = Route$i.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$q
});
const FindingsRoute = Route$h.update({
  id: "/findings",
  path: "/findings",
  getParentRoute: () => Route$q
});
const DashboardRoute = Route$g.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$q
});
const AssistantRoute = Route$f.update({
  id: "/assistant",
  path: "/assistant",
  getParentRoute: () => Route$q
});
const AnalyticsRoute = Route$e.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => Route$q
});
const IndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$q
});
const OciaIndexRoute = Route$c.update({
  id: "/ocia/",
  path: "/ocia/",
  getParentRoute: () => Route$q
});
const EvaluationsIndexRoute = Route$b.update({
  id: "/evaluations/",
  path: "/evaluations/",
  getParentRoute: () => Route$q
});
const AuditsIndexRoute = Route$a.update({
  id: "/audits/",
  path: "/audits/",
  getParentRoute: () => Route$q
});
const OciaSubmissionsRoute = Route$9.update({
  id: "/ocia/submissions",
  path: "/ocia/submissions",
  getParentRoute: () => Route$q
});
const OciaComplianceRoute = Route$8.update({
  id: "/ocia/compliance",
  path: "/ocia/compliance",
  getParentRoute: () => Route$q
});
const OagSubmissionsRoute = Route$7.update({
  id: "/oag/submissions",
  path: "/oag/submissions",
  getParentRoute: () => Route$q
});
const OagFindingsRoute = Route$6.update({
  id: "/oag/findings",
  path: "/oag/findings",
  getParentRoute: () => Route$q
});
const OagEngagementsRoute = Route$5.update({
  id: "/oag/engagements",
  path: "/oag/engagements",
  getParentRoute: () => Route$q
});
const EvaluationsIdRoute = Route$4.update({
  id: "/evaluations/$id",
  path: "/evaluations/$id",
  getParentRoute: () => Route$q
});
const AuthVerifyEmailRoute = Route$3.update({
  id: "/auth/verify-email",
  path: "/auth/verify-email",
  getParentRoute: () => Route$q
});
const AuthResetPasswordRoute = Route$2.update({
  id: "/auth/reset-password",
  path: "/auth/reset-password",
  getParentRoute: () => Route$q
});
const AuditsIdRoute = Route$1.update({
  id: "/audits/$id",
  path: "/audits/$id",
  getParentRoute: () => Route$q
});
const AuthInvitationsAcceptRoute = Route.update({
  id: "/auth/invitations/accept",
  path: "/auth/invitations/accept",
  getParentRoute: () => Route$q
});
const rootRouteChildren = {
  IndexRoute,
  AnalyticsRoute,
  AssistantRoute,
  DashboardRoute,
  FindingsRoute,
  NotificationsRoute,
  PlatformRoute,
  RegisterRoute,
  ReportsRoute,
  SettingsRoute,
  SubmissionsRoute,
  TeamsRoute,
  UsersRoute,
  AuditsIdRoute,
  AuthResetPasswordRoute,
  AuthVerifyEmailRoute,
  EvaluationsIdRoute,
  OagEngagementsRoute,
  OagFindingsRoute,
  OagSubmissionsRoute,
  OciaComplianceRoute,
  OciaSubmissionsRoute,
  AuditsIndexRoute,
  EvaluationsIndexRoute,
  OciaIndexRoute,
  AuthInvitationsAcceptRoute
};
const routeTree = Route$q._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  COAT_OF_ARMS as C,
  PRODUCT_LOGO as P,
  Route$4 as R,
  Shell as S,
  State as a,
  Route$1 as b,
  useBrandMark as c,
  Route as d,
  isPublicBody as i,
  router as r,
  useAuth as u
};
