import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { d as auditsApi, f as findingsApi } from "./api-_p3LF9GJ.mjs";
import "../_libs/sonner.mjs";
import { N as Sparkles, l as Send, Q as History } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
const SYSTEM_PROMPT = `You are an AI assistant embedded in Auditly, an audit management platform.

You assist internal audit teams with:
- Internal audit methodology: planning, fieldwork, reporting, and follow-up phases
- Risk frameworks: COSO Internal Control framework and ISO 31000 risk management
- Compliance standards: SOX (Sarbanes-Oxley), GDPR, and ISO 27001 information security
- Audit findings lifecycle: identification → assignment → remediation → closure
- Vendor management and contract review workflows
- KPIs: remediation rate, finding severity distribution, auditor performance metrics

Platform specifics:
- Findings have severity levels: Critical, High, Medium, Low
- Audits progress through stages: Planning → Fieldwork → Review → Closed
- Each finding has an assigned auditor, due date, and remediation status

Tone: professional, concise, use audit-industry terminology, provide short actionable answers.

When answering questions about counts, lists, or specific records, use ONLY the data provided in the LIVE WORKSPACE DATA block below. Do not invent or estimate numbers.`;
function buildWorkspaceContext(dashboard, audits, findings) {
  if (!dashboard && !audits && !findings) return "";
  const lines = ["\n\nLIVE WORKSPACE DATA (real data from the database, fetched this session):"];
  if (dashboard) {
    lines.push("\nDASHBOARD SUMMARY:");
    lines.push(`- Total audits: ${dashboard.total}`);
    lines.push(`- Overdue: ${dashboard.overdue}`);
    lines.push(`- Upcoming (next 7 days): ${dashboard.upcoming}`);
    const statusBreakdown = Object.entries(dashboard.byStatus).map(([k, v]) => `${k}: ${v}`).join(", ");
    if (statusBreakdown) lines.push(`- By status: ${statusBreakdown}`);
  }
  if (audits && audits.data.length > 0) {
    lines.push(`
AUDITS (${audits.total} total, showing ${audits.data.length}):`);
    audits.data.forEach((a, i) => {
      const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No due date";
      lines.push(`${i + 1}. ${a.title} | Status: ${a.status} | Due: ${due}${a.type ? ` | Type: ${a.type}` : ""}`);
    });
  } else if (audits) {
    lines.push("\nAUDITS: None found.");
  }
  if (findings && findings.data.length > 0) {
    lines.push(`
FINDINGS (${findings.total} total, showing ${findings.data.length}):`);
    findings.data.forEach((f, i) => {
      const due = f.deadline ? new Date(f.deadline).toLocaleDateString() : "No deadline";
      const a = f.assignee;
      const assignee = a ? a.firstName && a.lastName ? `${a.firstName} ${a.lastName}` : a.firstName ?? a.email : "Unassigned";
      lines.push(`${i + 1}. ${f.title} | Severity: ${f.severity} | Status: ${f.status} | Assigned to: ${assignee} | Deadline: ${due}`);
    });
  } else if (findings) {
    lines.push("\nFINDINGS: None found.");
  }
  return lines.join("\n");
}
const SUGGESTIONS = ["Which audits are overdue this month?", "Show me all critical findings that haven't been assigned", "What is the remediation rate for Q1?", "Which vendors have outstanding unreviewed contracts?", "Top 5 auditors by findings logged this quarter"];
function AssistantPage() {
  const {
    user
  } = useAuth();
  const firstName = user?.firstName ?? "there";
  const {
    data: dashboard
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => auditsApi.getDashboard(),
    staleTime: 6e4
  });
  const {
    data: auditsData
  } = useQuery({
    queryKey: ["audits", "assistant"],
    queryFn: () => auditsApi.getAll({
      take: 100
    }),
    staleTime: 6e4
  });
  const {
    data: findingsData
  } = useQuery({
    queryKey: ["findings", "assistant"],
    queryFn: () => findingsApi.getAll({
      take: 100
    }),
    staleTime: 6e4
  });
  const [messages, setMessages] = reactExports.useState([{
    role: "assistant",
    text: `Hi ${firstName} — ask me anything about your audits, findings, vendors, or team performance.`
  }]);
  const [input, setInput] = reactExports.useState("");
  const [thinking, setThinking] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, thinking]);
  const send = async (text) => {
    if (!text.trim()) return;
    const updatedMessages = [...messages, {
      role: "user",
      text
    }];
    setMessages(updatedMessages);
    setInput("");
    setThinking(true);
    try {
      const apiKey = "AIzaSyC3VSA3J2ZOEAAVr42IGopVr8FyqY7fOiA";
      const model = "gemini-2.5-flash-lite";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const workspaceContext = buildWorkspaceContext(dashboard, auditsData, findingsData);
      const fullSystemPrompt = SYSTEM_PROMPT + workspaceContext;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: fullSystemPrompt
            }]
          },
          contents: updatedMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{
              text: m.text
            }]
          }))
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? `API error ${response.status}`);
      }
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response. Please try again.";
      setMessages((m) => [...m, {
        role: "assistant",
        text: reply
      }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((m) => [...m, {
        role: "assistant",
        text: `Sorry, I ran into an error: ${message}`
      }]);
    } finally {
      setThinking(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Intelligence", title: "AI Assistant", description: "Natural-language interface for your audit data. Powered by your workspace context." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_300px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[60vh] flex-col rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5", children: [
          messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-3 ${m.role === "user" ? "justify-end" : ""}`, children: [
            m.role === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm slide-up ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`, children: m.text })
          ] }, i)),
          thinking && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }),
            " thinking…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          send(input);
        }, className: "flex items-center gap-2 border-t border-border/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask in plain English…", className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: thinking, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            " Suggestions"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(s), className: "block w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-accent", children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }),
            " Recent"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "No saved queries yet." })
        ] })
      ] })
    ] })
  ] });
}
export {
  AssistantPage as component
};
