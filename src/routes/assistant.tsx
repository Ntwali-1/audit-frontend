import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, History } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { auditsApi, findingsApi } from "@/lib/api";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · Auditly" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

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

function buildWorkspaceContext(
  dashboard: { total: number; overdue: number; upcoming: number; byStatus: Record<string, number> } | undefined,
  audits: { data: { title: string; status: string; dueDate: string | null; type: string | null }[]; total: number } | undefined,
  findings: { data: { title: string; severity: string; status: string; deadline: string | null; assignee?: { firstName: string | null; lastName: string | null; email: string } | null }[]; total: number } | undefined,
): string {
  if (!dashboard && !audits && !findings) return "";

  const lines: string[] = ["\n\nLIVE WORKSPACE DATA (real data from the database, fetched this session):"];

  if (dashboard) {
    lines.push("\nDASHBOARD SUMMARY:");
    lines.push(`- Total audits: ${dashboard.total}`);
    lines.push(`- Overdue: ${dashboard.overdue}`);
    lines.push(`- Upcoming (next 7 days): ${dashboard.upcoming}`);
    const statusBreakdown = Object.entries(dashboard.byStatus)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    if (statusBreakdown) lines.push(`- By status: ${statusBreakdown}`);
  }

  if (audits && audits.data.length > 0) {
    lines.push(`\nAUDITS (${audits.total} total, showing ${audits.data.length}):`);
    audits.data.forEach((a, i) => {
      const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No due date";
      lines.push(`${i + 1}. ${a.title} | Status: ${a.status} | Due: ${due}${a.type ? ` | Type: ${a.type}` : ""}`);
    });
  } else if (audits) {
    lines.push("\nAUDITS: None found.");
  }

  if (findings && findings.data.length > 0) {
    lines.push(`\nFINDINGS (${findings.total} total, showing ${findings.data.length}):`);
    findings.data.forEach((f, i) => {
      const due = f.deadline ? new Date(f.deadline).toLocaleDateString() : "No deadline";
      const a = f.assignee;
      const assignee = a
        ? (a.firstName && a.lastName ? `${a.firstName} ${a.lastName}` : a.firstName ?? a.email)
        : "Unassigned";
      lines.push(`${i + 1}. ${f.title} | Severity: ${f.severity} | Status: ${f.status} | Assigned to: ${assignee} | Deadline: ${due}`);
    });
  } else if (findings) {
    lines.push("\nFINDINGS: None found.");
  }

  return lines.join("\n");
}

const SUGGESTIONS = [
  "Which audits are overdue this month?",
  "Show me all critical findings that haven't been assigned",
  "What is the remediation rate for Q1?",
  "Which vendors have outstanding unreviewed contracts?",
  "Top 5 auditors by findings logged this quarter",
];

function AssistantPage() {
  const { user } = useAuth();
  const firstName = user?.firstName ?? "there";

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => auditsApi.getDashboard(),
    staleTime: 60_000,
  });

  const { data: auditsData } = useQuery({
    queryKey: ["audits", "assistant"],
    queryFn: () => auditsApi.getAll({ take: 100 }),
    staleTime: 60_000,
  });

  const { data: findingsData } = useQuery({
    queryKey: ["findings", "assistant"],
    queryFn: () => findingsApi.getAll({ take: 100 }),
    staleTime: 60_000,
  });

  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      text: `Hi ${firstName} — ask me anything about your audits, findings, vendors, or team performance.`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const updatedMessages: Msg[] = [...messages, { role: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setThinking(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      /*
       * The 2.5 line is closed to projects created after it shipped, so a fresh
       * API key cannot call it at all — the fallback has to name a model that
       * new projects can still reach.
       */
      const model = import.meta.env.VITE_GEMINI_MODEL_NAME ?? "gemini-3.5-flash-lite";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const workspaceContext = buildWorkspaceContext(dashboard, auditsData, findingsData);
      const fullSystemPrompt = SYSTEM_PROMPT + workspaceContext;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: fullSystemPrompt }] },
          contents: updatedMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as { error?: { message?: string } })?.error?.message ?? `API error ${response.status}`);
      }

      const data = await response.json();
      const reply: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response. Please try again.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((m) => [...m, { role: "assistant", text: `Sorry, I ran into an error: ${message}` }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="AI Assistant"
        description="Natural-language interface for your audit data. Powered by your workspace context."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex h-[60vh] flex-col rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl">
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm slide-up ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size={14} /> thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in plain English…"
              className="flex-1"
            />
            <Button type="submit" disabled={thinking}><Send className="h-4 w-4" /></Button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Suggestions
            </p>
            <div className="mt-3 space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <History className="h-3.5 w-3.5" /> Recent
            </p>
            <p className="mt-2 text-xs text-muted-foreground">No saved queries yet.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
