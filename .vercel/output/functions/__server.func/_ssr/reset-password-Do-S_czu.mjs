import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useSearch, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { m as apiFetch } from "./api-_p3LF9GJ.mjs";
import { S as Shell, a as State } from "./router-CdOLPATR.mjs";
import "../_libs/sonner.mjs";
import { e as CircleX, C as CircleCheck } from "../_libs/lucide-react.mjs";
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
function ResetPassword() {
  const {
    token
  } = useSearch({
    from: "/auth/reset-password"
  });
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [done, setDone] = reactExports.useState(false);
  const reset = useMutation({
    mutationFn: () => apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        newPassword: password
      })
    }),
    onSuccess: () => setDone(true)
  });
  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = password.length >= 8 && password === confirm && !!token;
  if (!token) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(State, { icon: CircleX, tone: "bad", title: "No reset token", body: "This link is missing its token. Open the link from your email exactly as it was sent." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-5 w-full", children: "Back to sign in" }) })
    ] });
  }
  if (done) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(State, { icon: CircleCheck, tone: "good", title: "Password updated", body: "You can sign in with your new password now." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-5 w-full", children: "Go to sign in" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Shell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[18px] font-semibold", style: {
      color: "var(--brown-800)"
    }, children: "Choose a new password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: "At least 8 characters." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-5 space-y-3 text-left", onSubmit: (e) => {
      e.preventDefault();
      reset.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "New password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoFocus: true }),
        tooShort && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12px]", style: {
          color: "#9B2C2C"
        }, children: "Too short." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Confirm password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value) }),
        mismatch && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12px]", style: {
          color: "#9B2C2C"
        }, children: "Passwords do not match." })
      ] }),
      reset.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border px-3 py-2 text-[12px]", style: {
        borderColor: "#F5B5B5",
        backgroundColor: "#FDECEC",
        color: "#9B2C2C"
      }, children: reset.error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: !canSubmit || reset.isPending, children: reset.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Update password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-3 w-full", children: "Back to sign in" }) })
  ] });
}
export {
  ResetPassword as component
};
