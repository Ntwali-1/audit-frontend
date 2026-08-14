import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useSearch, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { P as PRODUCT_LOGO } from "./router-CdOLPATR.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as apiFetch } from "./api-_p3LF9GJ.mjs";
import { e as CircleX, C as CircleCheck, M as Mail } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tailwind-merge.mjs";
function VerifyEmail() {
  const {
    token
  } = useSearch({
    from: "/auth/verify-email"
  });
  const [done, setDone] = reactExports.useState(false);
  const [resendTo, setResendTo] = reactExports.useState("");
  const verify = useMutation({
    mutationFn: () => apiFetch("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({
        token
      })
    }),
    onSuccess: () => setDone(true)
  });
  const resend = useMutation({
    mutationFn: () => apiFetch("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({
        email: resendTo
      })
    }),
    onSuccess: () => toast.success("Sent", {
      description: "Check your inbox for a new link."
    }),
    onError: (e) => toast.error("Could not resend", {
      description: e.message
    })
  });
  reactExports.useEffect(() => {
    if (token) verify.mutate();
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { children: !token ? /* @__PURE__ */ jsxRuntimeExports.jsx(State, { icon: CircleX, tone: "bad", title: "No verification token", body: "This link is missing its token. Open the link from your email exactly as it was sent." }) : verify.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[14px]", style: {
      color: "var(--text-muted)"
    }, children: "Verifying…" })
  ] }) : done ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(State, { icon: CircleCheck, tone: "good", title: "Email verified", body: "Your address is confirmed. You can sign in now." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-5 w-full", children: "Go to sign in" }) })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(State, { icon: CircleX, tone: "bad", title: "That link did not work", body: verify.error?.message ?? "The link may have expired or already been used." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Send a new link" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "you@institution.gov", value: resendTo, onChange: (e) => setResendTo(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => resend.mutate(), disabled: !resendTo || resend.isPending, children: resend.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-4 w-full", children: "Back to sign in" }) })
  ] }) });
}
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
export {
  Shell,
  State,
  VerifyEmail as component
};
