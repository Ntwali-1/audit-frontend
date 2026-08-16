import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Globe2,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_LOGO } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Auditly · Intelligent audit management" },
      {
        name: "description",
        content: "Run audit engagements, evidence, findings, reports, and statutory submissions in one intelligent workspace.",
      },
    ],
  }),
  component: LandingPage,
});

const partners = ["OAG", "OCIA", "Districts", "Ministries", "Private audit teams", "External auditees"];

const features = [
  {
    icon: ClipboardCheck,
    title: "Engagement command center",
    text: "Plan audits, assign steps, track fieldwork, and keep every team member aligned from kickoff to closeout.",
  },
  {
    icon: FileCheck2,
    title: "Evidence and findings workflow",
    text: "Collect documents, raise findings, verify remediation, and preserve a clean trail for review.",
  },
  {
    icon: Bot,
    title: "AI-assisted audit work",
    text: "Use the assistant to summarize evidence, draft observations, and surface next actions without leaving the workspace.",
  },
  {
    icon: Globe2,
    title: "Multi-portal collaboration",
    text: "Institution, OAG, OCIA, and auditee portals share the same source of truth with role-aware access.",
  },
  {
    icon: BarChart3,
    title: "Live risk visibility",
    text: "Spot overdue actions, recurring issues, severity trends, and reporting gaps while there is still time to act.",
  },
  {
    icon: LockKeyhole,
    title: "Built for accountability",
    text: "Tenant boundaries, role controls, and audit history keep sensitive work protected and traceable.",
  },
];

const metrics = [
  ["42%", "faster closeout cycles"],
  ["3x", "clearer finding ownership"],
  ["100%", "traceable submissions"],
];

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#111312]">
      <Hero />
      <LogoBand />
      <FeatureSection />
      <WorkflowSection />
      <InsightsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07110d] text-white">
      <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_20%_10%,rgba(38,196,133,0.28),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(96,165,250,0.18),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)]" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <img src={PRODUCT_LOGO} alt="Auditly" className="h-6 w-6 object-contain" />
            </span>
            <span className="font-display text-[17px] font-semibold">Auditly</span>
          </Link>
          <div className="hidden items-center gap-7 text-[13px] text-white/72 md:flex">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#insights" className="hover:text-white">Insights</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden rounded-full px-4 text-white hover:bg-white/10 hover:text-white sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full bg-white px-4 text-[#07110d] shadow-none hover:bg-white/90">
              <Link to="/register">Register <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[0.96fr_1.04fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-[12px] font-medium text-emerald-100">
              <Sparkles className="h-3.5 w-3.5" />
              Intelligent audit operations for modern institutions
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-[48px] font-semibold leading-[0.98] tracking-normal sm:text-[68px] lg:text-[78px]">
              Audit work, evidence, and reporting in one calm system.
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-white/68 sm:text-[18px]">
              Auditly brings institutions, audit offices, and auditees into a shared workspace for planning, findings, remediation, and statutory reporting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full bg-emerald-300 px-6 text-[#07110d] hover:bg-emerald-200">
                <Link to="/register">Start institution setup <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full border-white/18 bg-white/[0.04] px-6 text-white hover:bg-white/10 hover:text-white">
                <Link to="/login">Open workspace</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
            <div className="absolute -inset-6 rounded-[36px] bg-emerald-300/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#101a16]/92 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-[#f6f7f3] text-[#111312]">
      <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <span className="rounded-full bg-[#eef3ec] px-3 py-1 text-[11px] font-medium text-[#587064]">Live audit board</span>
      </div>
      <div className="grid min-h-[440px] grid-cols-1 sm:grid-cols-[160px_1fr]">
        <aside className="hidden border-r border-black/5 bg-[#101a16] p-4 text-white sm:block">
          <div className="mb-7 flex items-center gap-2 text-[13px] font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Internal Audit
          </div>
          {["Overview", "Engagements", "Findings", "Reports"].map((item, index) => (
            <div key={item} className={`mb-2 rounded-lg px-3 py-2 text-[12px] ${index === 1 ? "bg-white/12 text-white" : "text-white/48"}`}>
              {item}
            </div>
          ))}
        </aside>
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#718078]">Q3 assurance plan</p>
              <h2 className="mt-1 font-display text-[24px] font-semibold">Rwamagana District Audit</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-800">On track</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map(([value, label]) => (
              <div key={label} className="rounded-xl border border-black/6 bg-white p-4">
                <p className="font-display text-[24px] font-semibold">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-[#68756f]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-xl border border-black/6 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-semibold">Finding severity</p>
                <BarChart3 className="h-4 w-4 text-[#68756f]" />
              </div>
              <div className="flex h-40 items-end gap-3">
                {[58, 36, 78, 48, 68, 32, 86].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-t-md bg-[#101a16]"
                    style={{ height: `${height}%`, opacity: 0.32 + index * 0.08 }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-black/6 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-emerald-700" />
                <p className="text-[13px] font-semibold">Assistant brief</p>
              </div>
              <div className="space-y-3 text-[12px] leading-5 text-[#5f6d66]">
                <p className="rounded-lg bg-[#f1f5ef] p-3">Three procurement findings need management response before Friday.</p>
                <p className="rounded-lg bg-[#f1f5ef] p-3">Evidence gaps detected in payroll testing step 4.2.</p>
                <p className="rounded-lg bg-emerald-50 p-3 text-emerald-900">Draft report summary is ready for review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoBand() {
  return (
    <section className="border-y border-black/6 bg-white py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.12em] text-[#718078]">
          Designed for every audit stakeholder
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div key={partner} className="flex h-14 items-center justify-center rounded-xl border border-black/6 bg-[#f7f8f5] text-center text-[13px] font-semibold text-[#33443b]">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="platform" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Built-in intelligence</p>
          <h2 className="mt-3 font-display text-[38px] font-semibold leading-tight sm:text-[50px]">
            End-to-end audit management without scattered files.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,18,0.05)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4ed] text-emerald-800">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[20px] font-semibold">{feature.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#637069]">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workflow" className="bg-[#101a16] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">How it works</p>
          <h2 className="mt-3 font-display text-[38px] font-semibold leading-tight sm:text-[50px]">
            From annual plan to signed report.
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-white/62">
            Auditly keeps every handoff visible: auditors request evidence, auditees respond, managers review, and oversight offices receive clean submissions.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            ["Scope the engagement", "Create audits, steps, teams, deadlines, and documentation requirements."],
            ["Collect and evaluate", "Track evidence, conversations, exceptions, and review notes together."],
            ["Resolve findings", "Assign owners, verify action plans, and monitor remediation progress."],
            ["Submit with confidence", "Generate reports and route them to the right portal with traceable status."],
          ].map(([title, text], index) => (
            <div key={title} className="grid grid-cols-[44px_1fr] gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300 text-[14px] font-bold text-[#101a16]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-display text-[19px] font-semibold">{title}</h3>
                <p className="mt-2 text-[14px] leading-7 text-white/58">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection() {
  const insightCards: Array<[typeof Workflow, string, string]> = [
    [Workflow, "Workflow health", "12 active engagements"],
    [UsersRound, "Owner response", "89% on time"],
    [Building2, "Institution coverage", "24 units monitored"],
    [FileText, "Report readiness", "7 drafts ready"],
  ];

  return (
    <section id="insights" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="rounded-[28px] border border-black/6 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,18,0.08)]">
          <div className="rounded-[20px] bg-[#f2f5ef] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[22px] font-semibold">Risk intelligence</h3>
              <Layers3 className="h-5 w-5 text-emerald-800" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {insightCards.map(([Icon, title, text]) => (
                <div key={title} className="rounded-2xl bg-white p-4">
                  <Icon className="h-5 w-5 text-emerald-800" />
                  <p className="mt-4 text-[13px] font-semibold">{title}</p>
                  <p className="mt-1 text-[12px] text-[#6a776f]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Measurable ROI</p>
          <h2 className="mt-3 font-display text-[38px] font-semibold leading-tight sm:text-[50px]">
            Turn audit activity into action leaders can trust.
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-[#637069]">
            Replace fragmented status chasing with a real-time operating layer for accountability, evidence, deadlines, and remediation.
          </p>
          <div className="mt-7 space-y-3">
            {["Reduce manual reporting work", "Find stalled remediation earlier", "Keep oversight submissions consistent"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[14px] font-medium">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-5 pb-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#07110d] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">Ready for a cleaner audit cycle?</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-[38px] font-semibold leading-tight sm:text-[54px]">
          Bring your institution onto Auditly.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-white/62">
          Register your institution, invite your audit team, and start managing engagements from one secure workspace.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-12 rounded-full bg-emerald-300 px-6 text-[#07110d] hover:bg-emerald-200">
            <Link to="/register">Register institution <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full border-white/18 bg-white/[0.04] px-6 text-white hover:bg-white/10 hover:text-white">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/6 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-[13px] text-[#68756f] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-2 font-semibold text-[#111312]">
          <img src={PRODUCT_LOGO} alt="Auditly" className="h-6 w-6 object-contain" />
          Auditly
        </Link>
        <span>© 2026 Auditly · Nema Technologies</span>
      </div>
    </footer>
  );
}
