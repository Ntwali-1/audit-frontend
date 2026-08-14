import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth, d as Route, P as PRODUCT_LOGO } from "./router-CdOLPATR.mjs";
import { b as authApi } from "./api-_p3LF9GJ.mjs";
import "../_libs/sonner.mjs";
import { ab as EyeOff, ac as Eye } from "../_libs/lucide-react.mjs";
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
function AcceptInvitationPage() {
  const navigate = useNavigate();
  const {
    setAuth
  } = useAuth();
  const {
    token
  } = Route.useSearch();
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [prefilling, setPrefilling] = reactExports.useState(true);
  const [tokenError, setTokenError] = reactExports.useState(null);
  const [submitError, setSubmitError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!token) {
      setPrefilling(false);
      return;
    }
    authApi.getInvitationInfo(token).then((info) => {
      setEmail(info.email);
      setFullName(info.fullName);
      setPhone(info.phone);
    }).catch((err) => {
      setTokenError(err instanceof Error ? err.message : "This invitation link is invalid or has expired.");
    }).finally(() => setPrefilling(false));
  }, [token]);
  if (!token || tokenError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border bg-white p-10 text-center", style: {
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-modal)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full", style: {
        backgroundColor: "var(--brown-100)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: PRODUCT_LOGO, alt: "Auditly", className: "h-7 w-7 object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[20px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: !token ? "Invalid link" : "Invitation expired" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: !token ? "This invitation link is missing its token. Please use the link from your email." : tokenError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6 w-full rounded-[10px]", onClick: () => navigate({
        to: "/"
      }), children: "Go to sign in" })
    ] }) });
  }
  if (prefilling) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[color:var(--cream)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (password.length < 6) {
      setSubmitError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setSubmitError("Passwords do not match.");
      return;
    }
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || firstName;
    setLoading(true);
    try {
      const data = await authApi.acceptInvitation({
        token,
        firstName,
        lastName,
        phone: phone || void 0,
        password
      });
      setAuth(data.accessToken, data.refreshToken, data.user);
      navigate({
        to: "/dashboard"
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-[color:var(--cream)] bg-dot-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden flex-col justify-between overflow-hidden p-12 md:flex md:w-1/2", style: {
      backgroundColor: "var(--brown-800)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/95", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: PRODUCT_LOGO, alt: "Auditly", className: "h-6 w-6 object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[16px] font-semibold text-white", children: "Auditly" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[40px] font-medium leading-[1.1] tracking-tight text-white", children: [
          "You've been invited",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: "var(--brown-200)"
          }, children: "to Auditly." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-[14px] leading-relaxed text-white/65", children: "Confirm your details and set a password to activate your account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative z-10 text-[11px] text-white/40", children: "© 2026 Auditly · Nema Technologies" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center p-6 md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border bg-white p-10", style: {
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-modal)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Account setup" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-[24px] font-medium tracking-tight", style: {
        color: "var(--brown-800)"
      }, children: "Complete your profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "Your details have been pre-filled. Set a password to activate your account." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-5 block h-[3px] w-16 rounded-sm", style: {
        background: "linear-gradient(90deg, var(--brown-400), transparent)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullName", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fullName", placeholder: "Jane Smith", value: fullName, onChange: (e) => setFullName(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Phone number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", placeholder: "+1 234 567 8900", value: phone, onChange: (e) => setPhone(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Email address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, readOnly: true, className: "cursor-not-allowed opacity-60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "Min. 6 characters", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "pr-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", tabIndex: -1, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm", className: "mb-1 block text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: "Confirm password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirm", type: "password", placeholder: "Re-enter password", value: confirm, onChange: (e) => setConfirm(e.target.value), required: true })
        ] }),
        submitError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700", children: submitError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-[42px] w-full rounded-[10px]", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16, invert: true }) : "Activate account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-[12px]", style: {
        color: "var(--text-hint)"
      }, children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "font-medium underline-offset-2 hover:underline", style: {
          color: "var(--brown-600)"
        }, onClick: () => navigate({
          to: "/"
        }), children: "Sign in" })
      ] })
    ] }) })
  ] });
}
export {
  AcceptInvitationPage as component
};
