import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, History } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant · Auditly" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "Which audits are overdue this month?",
  "Show me all critical findings that haven't been assigned",
  "What is the remediation rate for Q1?",
  "Which vendors have outstanding unreviewed contracts?",
  "Top 5 auditors by findings logged this quarter",
];

function AssistantPage() {
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", text: "Hi Sarah — ask me anything about your audits, findings, vendors, or team performance." },
  ]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, {
        role: "assistant",
        text: `Based on your workspace I found 3 audits matching “${text}”. Two are in progress (AUD-001, AUD-005) and one is in review (AUD-002). I can break this down by team, vendor, or severity — just ask.`,
      }]);
    }, 900);
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
