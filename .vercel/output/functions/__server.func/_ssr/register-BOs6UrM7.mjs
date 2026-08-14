import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { O as ORG_TYPE_LABEL, r as registrationApi } from "./api-portals-CZRRb1RU.mjs";
import { C as COAT_OF_ARMS, P as PRODUCT_LOGO, i as isPublicBody } from "./router-CdOLPATR.mjs";
import { A as ArrowLeft, B as Building2, q as UserCog, f as UsersRound, C as CircleCheck, r as ArrowRight, s as Clock, X, P as Plus } from "../_libs/lucide-react.mjs";
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
import "./api-_p3LF9GJ.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const REGISTRABLE_TYPES = ["GOVERNMENT_DISTRICT", "GOVERNMENT_INSTITUTION", "PRIVATE_COMPANY"];
const STEPS = [{
  id: 0,
  label: "Institution",
  icon: Building2,
  hint: "Who you are"
}, {
  id: 1,
  label: "Your account",
  icon: UserCog,
  hint: "Who is registering"
}, {
  id: 2,
  label: "Audit team",
  icon: UsersRound,
  hint: "Who you work with"
}, {
  id: 3,
  label: "Review",
  icon: CircleCheck,
  hint: "Check and submit"
}];
function RegisterInstitution() {
  const [step, setStep] = reactExports.useState(0);
  const [submitted, setSubmitted] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [type, setType] = reactExports.useState("");
  const [district, setDistrict] = reactExports.useState("");
  const [contactEmail, setContactEmail] = reactExports.useState("");
  const [contactPhone, setContactPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [firstName, setFirstName] = reactExports.useState("");
  const [lastName, setLastName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [jobTitle, setJobTitle] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [team, setTeam] = reactExports.useState([]);
  const payload = {
    institution: {
      name: name.trim(),
      type,
      ...district ? {
        district
      } : {},
      ...contactEmail ? {
        contactEmail
      } : {},
      ...contactPhone ? {
        contactPhone
      } : {},
      ...address ? {
        address
      } : {}
    },
    registrant: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      ...jobTitle ? {
        jobTitle
      } : {},
      ...phone ? {
        phone
      } : {}
    },
    ...team.length > 0 ? {
      team: team.filter((t) => t.email.trim()).map((t) => ({
        email: t.email.trim().toLowerCase(),
        ...t.fullName ? {
          fullName: t.fullName
        } : {},
        role: t.role
      }))
    } : {}
  };
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => registrationApi.registerInstitution(payload),
    onSuccess: (res) => setSubmitted({
      message: res.message,
      invites: res.teamInvitesQueued
    }),
    onError: (e) => toast.error("Could not submit", {
      description: e.message
    })
  });
  const stepValid = [
    name.trim().length >= 2 && !!type,
    firstName.trim() && lastName.trim() && /\S+@\S+\.\S+/.test(email) && password.length >= 8 && password === confirm,
    true,
    // the team step is optional
    true
  ][step];
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SubmittedScreen, { message: submitted.message, invites: submitted.invites });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[color:var(--cream)] bg-dot-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: isPublicBody(type || void 0) ? COAT_OF_ARMS : PRODUCT_LOGO, alt: isPublicBody(type || void 0) ? "Republic of Rwanda" : "Auditly", className: "h-6 w-6 object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15px] font-semibold", style: {
          color: "var(--brown-800)"
        }, children: "Auditly" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-[13px] hover:underline", style: {
        color: "var(--text-muted)"
      }, children: "Already registered? Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[26px] font-semibold leading-tight", style: {
        color: "var(--brown-800)"
      }, children: "Register your institution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[14px]", style: {
        color: "var(--text-muted)"
      }, children: "Takes about two minutes. We review every application before it goes live." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stepper, { current: step, onJump: (i) => i < step && setStep(i) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex-1 rounded-2xl border bg-white p-6", style: {
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-card)"
    }, children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "About the institution", blurb: "Enough for us to confirm you are who you say you are.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Institution name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "Nyaruka District" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Type", required: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a type…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: REGISTRABLE_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: ORG_TYPE_LABEL[t] }, t)) })
          ] }),
          type === "PRIVATE_COMPANY" && /* @__PURE__ */ jsxRuntimeExports.jsx(Note, { children: "Private organizations run the full audit programme, but have no statutory obligation to file yearly reports with OAG or OCIA." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "District or province", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: district, onChange: (e) => setDistrict(e.target.value), placeholder: "Eastern Province" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Official phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: contactPhone, onChange: (e) => setContactPhone(e.target.value), placeholder: "+250 788 000 000" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Official email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: contactEmail, onChange: (e) => setContactEmail(e.target.value), placeholder: "info@nyaruka.gov.rw" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "KG 11 Ave, Kigali" }) })
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Your account", blurb: "You become the institution's first audit manager and can invite everyone else.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "First name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: firstName, onChange: (e) => setFirstName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: lastName, onChange: (e) => setLastName(e.target.value) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Work email", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "claire@nyaruka.gov.rw" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Job title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: jobTitle, onChange: (e) => setJobTitle(e.target.value), placeholder: "Head of Internal Audit" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Password", required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value) }),
            password.length > 0 && password.length < 8 && /* @__PURE__ */ jsxRuntimeExports.jsx(Warn, { children: "At least 8 characters." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Confirm password", required: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value) }),
            confirm.length > 0 && confirm !== password && /* @__PURE__ */ jsxRuntimeExports.jsx(Warn, { children: "Passwords do not match." })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Your audit team", blurb: "Optional. Everyone you add is invited automatically the moment your institution is approved — no email goes out before then.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TeamEditor, { team, setTeam }) }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Check and submit", blurb: "Nothing is live yet. We review the application and email you the outcome.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Review, { label: "Institution", rows: [["Name", name], ["Type", type ? ORG_TYPE_LABEL[type] : "—"], ["District", district || "—"], ["Official email", contactEmail || "—"], ["Phone", contactPhone || "—"], ["Address", address || "—"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Review, { label: "You", rows: [["Name", `${firstName} ${lastName}`.trim()], ["Email", email], ["Job title", jobTitle || "—"], ["Role", "Audit Manager"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Review, { label: `Audit team (${team.length})`, rows: team.length === 0 ? [["", "None — you can invite people once you are in."]] : team.map((t) => [t.email, t.role === "LEAD_AUDITOR" ? "Lead Auditor" : "Auditor"]) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border px-3 py-2 text-[13px]", style: {
          borderColor: "#F5B5B5",
          backgroundColor: "#FDECEC",
          color: "#9B2C2C"
        }, children: error.message })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setStep((s) => s - 1), disabled: step === 0 || isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
        " Back"
      ] }),
      step < STEPS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setStep((s) => s + 1), disabled: !stepValid, children: [
        "Continue ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Submitting…" })
      ] }) : "Submit application" })
    ] })
  ] }) });
}
function Stepper({
  current,
  onJump
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-2", children: STEPS.map((s, i) => {
    const done = i < current;
    const active = i === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onJump(i), disabled: i >= current, className: "flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition disabled:cursor-default", style: {
        borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
        backgroundColor: active ? "var(--brown-50)" : done ? "#E6F4ED" : "transparent"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4 shrink-0", style: {
          color: active ? "var(--brown-800)" : done ? "#1A6638" : "var(--text-hint)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden min-w-0 sm:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-[12px] font-medium", style: {
            color: active || done ? "var(--brown-800)" : "var(--text-muted)"
          }, children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-[10px]", style: {
            color: "var(--text-hint)"
          }, children: s.hint })
        ] })
      ] }),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1", style: {
        backgroundColor: i < current ? "#A8D5BA" : "var(--border-subtle)"
      } })
    ] }, s.id);
  }) });
}
function TeamEditor({
  team,
  setTeam
}) {
  const add = () => setTeam([...team, {
    email: "",
    fullName: "",
    role: "AUDITOR"
  }]);
  const update = (i, patch) => setTeam(team.map((t, idx) => idx === i ? {
    ...t,
    ...patch
  } : t));
  const remove = (i) => setTeam(team.filter((_, idx) => idx !== i));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    team.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border px-3 py-3 text-[13px]", style: {
      borderColor: "var(--border-subtle)",
      color: "var(--text-muted)"
    }, children: "No team members yet. You can skip this and invite people later." }),
    team.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 rounded-xl border p-3 sm:grid-cols-[1.4fr_1fr_auto_auto]", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "eric@nyaruka.gov.rw", value: row.email, onChange: (e) => update(i, {
        email: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name (optional)", value: row.fullName, onChange: (e) => update(i, {
        fullName: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.role, onValueChange: (v) => update(i, {
        role: v
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "min-w-[9.5rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUDITOR", children: "Auditor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LEAD_AUDITOR", children: "Lead Auditor" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(i), className: "flex h-9 w-9 items-center justify-center self-center rounded-lg hover:bg-red-50", style: {
        color: "var(--text-muted)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: add, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Add team member"
    ] })
  ] });
}
function SubmittedScreen({
  message,
  invites
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-2xl border bg-white p-8 text-center", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl", style: {
      backgroundColor: "#FEF3E2"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6", style: {
      color: "#854F0B"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-[20px] font-semibold", style: {
      color: "var(--brown-800)"
    }, children: "Application submitted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px]", style: {
      color: "var(--text-muted)"
    }, children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2 rounded-xl border p-4 text-left text-[13px]", style: {
      borderColor: "var(--border-subtle)",
      color: "var(--text-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", style: {
        color: "var(--brown-800)"
      }, children: "What happens next" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "1. We check the institution details against public records." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "2. You get an email once it is approved, and can sign in straight away." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "3. ",
        invites > 0 ? `Your ${invites} team invitation${invites === 1 ? "" : "s"} go out at the same moment — not before.` : "You can invite your audit team from inside the app."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-6", children: "Back to sign in" }) })
  ] }) });
}
function Section({
  title,
  blurb,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[16px] font-semibold", style: {
      color: "var(--brown-800)"
    }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: blurb }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-4", children })
  ] });
}
function Field({
  label,
  required,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        color: "#9B2C2C"
      }, children: " *" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children })
  ] });
}
function Note({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 rounded-lg border px-3 py-2 text-[12px]", style: {
    borderColor: "var(--border-subtle)",
    color: "var(--text-muted)"
  }, children });
}
function Warn({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12px]", style: {
    color: "#9B2C2C"
  }, children });
}
function Review({
  label,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-4", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[12px] font-medium uppercase tracking-wide", style: {
      color: "var(--text-hint)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: rows.map(([k, v], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-[13px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36 shrink-0", style: {
        color: "var(--text-muted)"
      }, children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 break-words", style: {
        color: "var(--brown-800)"
      }, children: v })
    ] }, i)) })
  ] });
}
export {
  RegisterInstitution as component
};
