import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth, P as PRODUCT_LOGO } from "./router-CdOLPATR.mjs";
import { b as authApi } from "./api-_p3LF9GJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tailwind-merge.mjs";
function SignIn() {
  const navigate = useNavigate();
  const {
    setAuth
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setAuth(data.accessToken, data.refreshToken, data.user);
      const portal = data.user.portalType ?? "INSTITUTION";
      navigate({
        to: portal === "OAG" ? "/oag/engagements" : portal === "OCIA" ? "/ocia" : "/dashboard"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast.error("Sign in failed", {
        description: err instanceof Error ? err.message : "Check your credentials"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-[color:var(--cream)] bg-dot-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden flex-col justify-between overflow-hidden bg-linen p-12 md:flex md:w-1/2", style: {
      backgroundColor: "var(--brown-800)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: PRODUCT_LOGO, alt: "Auditly", className: "h-7 w-7 object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[18px] font-semibold text-white font-display", children: "Auditly" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[40px] font-medium leading-[1.1] tracking-tight text-white", children: [
          "A calmer way to run",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: "var(--brown-200)"
          }, children: "complex audits." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-[14px] leading-relaxed text-white/65", children: "Manage engagements, evidence, findings, and reports — all in one warm, focused workspace." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative z-10 text-[11px] text-white/40", children: "© 2026 Auditly · Nema Technologies" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center p-6 md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border bg-white p-10", style: {
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-modal)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-[24px] font-medium tracking-tight", style: {
        color: "var(--brown-800)"
      }, children: "Sign in to Auditly" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "Enter your credentials to access your workspace." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-5 block h-[3px] w-16 rounded-sm", style: {
        background: "linear-gradient(90deg, var(--brown-400), transparent)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "you@company.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), required: true })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-red-600", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-[42px] w-full rounded-[10px]", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16, invert: true }) : "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-1 text-center text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: [
          "Institution not on Auditly yet?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "font-medium hover:underline", style: {
            color: "var(--brown-800)"
          }, children: "Register it" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  SignIn as component
};
