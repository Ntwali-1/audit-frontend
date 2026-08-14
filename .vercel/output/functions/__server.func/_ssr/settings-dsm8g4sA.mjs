import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DIP6aEiT.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { b as authApi } from "./api-_p3LF9GJ.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/tailwind-merge.mjs";
function Settings() {
  const {
    user,
    setAuth
  } = useAuth();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = reactExports.useState(user?.firstName ?? "");
  const [lastName, setLastName] = reactExports.useState(user?.lastName ?? "");
  reactExports.useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  }, [user]);
  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error
  } = useMutation({
    mutationFn: () => authApi.updateProfile({
      firstName,
      lastName
    }),
    onSuccess: (updated) => {
      const stored = localStorage.getItem("auth_user");
      const token = localStorage.getItem("access_token") ?? "";
      const refresh = localStorage.getItem("refresh_token") ?? "";
      if (stored) {
        const merged = {
          ...JSON.parse(stored),
          ...updated
        };
        setAuth(token, refresh, merged);
      }
      queryClient.invalidateQueries({
        queryKey: ["auth", "me"]
      });
    }
  });
  const roleLabel = user?.role ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Intelligence", title: "Settings", description: "Manage your profile and preferences." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Profile" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "firstName", children: "First name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "firstName", value: firstName, onChange: (e) => setFirstName(e.target.value), className: "mt-1.5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "lastName", children: "Last name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "lastName", value: lastName, onChange: (e) => setLastName(e.target.value), className: "mt-1.5" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: user?.email ?? "", disabled: true, className: "mt-1.5 opacity-60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Email cannot be changed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "role", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "role", value: roleLabel, disabled: true, className: "mt-1.5 opacity-60" })
          ] }),
          isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600", children: "Profile updated successfully." }),
          isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error instanceof Error ? error.message : "Failed to update profile." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending, children: isPending ? "Saving…" : "Save changes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Account info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "User ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: user?.id ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Verified" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user?.isVerified ? "Yes" : "No" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Member since" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Settings as component
};
