import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  FileCheck2,
  Github,
  Home,
  ShieldCheck,
  Twitter,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_LOGO } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Auditly - Intelligent audit management" },
      {
        name: "description",
        content: "Autonomous audit intelligence for engagements, evidence, findings, and statutory reporting.",
      },
    ],
  }),
  component: LandingPage,
});

const candidates = [
  ["R", "Revenue Controls", "Financial Audit", "96", "REVIEWING"],
  ["P", "Procurement Cycle", "Compliance", "91", "ACTIVE"],
  ["A", "Asset Register", "Operations", "82", "DRAFT"],
  ["G", "Grant Reporting", "Financial Audit", "94", "REVIEWING"],
];

const systems = [
  {
    no: "01",
    title: "INTAKE INTELLIGENCE",
    text: "Capture audit requests, institutional context, and annual plan priorities without scattered spreadsheets.",
  },
  {
    no: "02",
    title: "NEURAL EVIDENCE FLOW",
    text: "Connect teams, evidence folders, submissions, and conversations into one clear review trail.",
  },
  {
    no: "03",
    title: "AUTONOMOUS FINDINGS",
    text: "Issues are tracked in real time. Only verified findings reach managers with the context they need.",
  },
  {
    no: "04",
    title: "SMART REPORTING",
    text: "Auditly prepares clean report packets and highlights gaps before oversight submissions are due.",
  },
];

const faqs = [
  "HOW DOES AUDITLY REDUCE AUDIT DELAYS?",
  "WHAT MAKES AUDITLY DIFFERENT FROM SPREADSHEETS?",
  "HOW LONG DOES IT TAKE TO SET UP AN INSTITUTION?",
];

function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfcfd] text-[#182230]">
      <FloatingNav />
      <Hero />
      <DemoSection />
      <SystemsSection />
      <FaqSection />
      <Footer />
      <Link
        to="/"
        aria-label="Back home"
        className="fixed bottom-6 right-9 z-40 hidden h-12 w-12 items-center justify-center rounded-full border border-[#e4e8ee] bg-white text-[#7a8492] shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition hover:text-[#182230] md:flex"
      >
        <Home className="h-4 w-4" />
      </Link>
    </main>
  );
}

function FloatingNav() {
  return (
    <header className="fixed left-0 right-0 top-3 z-50 px-4">
      <nav className="mx-auto flex h-10 max-w-[670px] items-center justify-between rounded-[20px] border border-[#dfe4eb] bg-white/88 px-3 shadow-[0_9px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <Link to="/" className="flex min-w-[112px] items-center gap-2 text-[14px] font-bold text-[#17212d]">
          <img src={PRODUCT_LOGO} alt="Auditly" className="h-4 w-4 object-contain" />
          Auditly
        </Link>
        <div className="hidden items-center gap-7 text-[11px] font-medium text-[#536070] md:flex">
          <a href="#intelligence" className="transition hover:text-[#17212d]">Intelligence</a>
          <a href="#story" className="transition hover:text-[#17212d]">Story</a>
          <a href="#scale" className="transition hover:text-[#17212d]">Scale</a>
          <a href="#systems" className="transition hover:text-[#17212d]">Systems</a>
          <a href="#support" className="transition hover:text-[#17212d]">Support</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden h-4 w-px bg-[#d7dce3] md:block" />
          <Link to="/login" className="text-[11px] font-semibold text-[#111820]">
            Sign In
          </Link>
          <Button asChild className="h-7 rounded-[8px] bg-[#121417] px-4 text-[10px] font-bold tracking-[0.12em] text-white shadow-none hover:bg-black">
            <Link to="/register">GET STARTED</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="intelligence" className="relative min-h-[680px] overflow-hidden bg-[#fbfcfd] pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-[150px] h-[450px] opacity-80">
        <div className="absolute left-[-8%] top-[100px] h-[150px] w-[118%] -rotate-[1.5deg] rounded-[80px] bg-gradient-to-r from-[#e9edf2] via-[#f7f8fa] to-[#e1e6ec] blur-[1px]" />
        <div className="absolute right-[-2%] top-[84px] h-[120px] w-[68%] -rotate-[9deg] rounded-full bg-gradient-to-r from-[#eef2f5] via-[#f8fafc] to-[#e7ebf0] shadow-[0_40px_90px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-[12%] top-[16px] h-[350px] w-[155px] -rotate-[14deg] rounded-[28px] border border-white/80 bg-gradient-to-br from-[#e8ecf1] via-[#f8fafc] to-[#dce2e9] shadow-[inset_0_0_0_12px_rgba(255,255,255,0.45)]" />
        <div className="absolute bottom-[12px] left-[27%] h-[118px] w-[118px] rounded-full border-[18px] border-[#eef2f5] bg-white/50 shadow-[0_24px_70px_rgba(15,23,42,0.1)]" />
        <div className="absolute bottom-[16px] right-[4%] h-[118px] w-[118px] rounded-full border-[18px] border-[#eef2f5] bg-white/50 shadow-[0_24px_70px_rgba(15,23,42,0.1)]" />
        <div className="absolute inset-x-0 bottom-0 h-[230px] bg-gradient-to-b from-transparent via-white/80 to-white" />
        <div className="absolute inset-0 bg-white/38" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[850px] flex-col items-center justify-center px-5 text-center">
        <div className="rounded-full border border-[#e7ebf0] bg-white/76 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8893a3] shadow-[0_7px_20px_rgba(15,23,42,0.04)]">
          Autonomous audit intelligence
        </div>
        <h1 className="mt-7 font-display text-[56px] font-medium leading-[0.96] tracking-normal text-[#17212d] sm:text-[68px]">
          Audit.<span className="text-[#c5cbd4]">Perfectly.</span>
        </h1>
        <p className="mt-6 max-w-[560px] text-[18px] leading-[1.45] text-[#788393]">
          Auditly uses deep operational reasoning to identify risk, evidence gaps, and reporting priorities while your team focuses on assurance.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild className="h-[42px] min-w-[180px] rounded-full bg-[#1d2836] px-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_26px_rgba(15,23,42,0.16)] hover:bg-[#111820]">
            <Link to="/register">Begin onboarding</Link>
          </Button>
          <Button asChild variant="outline" className="h-[42px] min-w-[194px] rounded-full border-white bg-white px-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3d4652] shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-white hover:text-[#111820]">
            <a href="#story">Watch intelligence</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="story" className="bg-white px-5 pb-24 pt-8">
      <div className="mx-auto max-w-[980px] text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ecf1] bg-[#fbfcfd] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#758090]">
          <span className="h-2 w-2 rounded-full bg-[#17212d]" />
          Live platform demo
        </div>
        <h2 className="mt-5 font-display text-[36px] font-medium leading-none tracking-normal text-[#17212d] sm:text-[40px]">
          See Auditly <span className="text-[#c9ced7]">in action.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[#728091]">
          Our AI processes engagement activity in seconds. Here is what your audit command center looks like.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-[912px] overflow-hidden rounded-[22px] border border-[#dfe4ea] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <ProductDemo />
      </div>
    </section>
  );
}

function ProductDemo() {
  return (
    <div>
      <div className="flex h-[38px] items-center gap-2 border-b border-[#edf0f4] bg-[#fafbfc] px-4">
        <span className="h-9 w-9" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff8f8f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f8d65d]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#70d88c]" />
        <div className="ml-4 h-[18px] flex-1 rounded-full border border-[#e5e9ee] bg-white px-3 text-left text-[9px] leading-[18px] text-[#c8ced7]">
          app.auditly.ai/dashboard
        </div>
      </div>
      <div className="grid min-h-[388px] grid-cols-1 md:grid-cols-[156px_1fr]">
        <aside className="hidden border-r border-[#edf0f4] px-4 py-5 md:block">
          <div className="flex items-center gap-2 border-b border-[#edf0f4] pb-4 text-[11px] font-bold text-[#17212d]">
            <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#1d2836]" />
            Auditly
          </div>
          {["Overview", "Audits", "Evidence", "Findings", "Reports", "Submissions"].map((item, index) => (
            <div
              key={item}
              className={`mt-2 flex h-7 items-center gap-3 rounded-[8px] px-3 text-[11px] font-medium ${
                index === 1 ? "bg-[#f0f2f5] text-[#17212d]" : "text-[#8792a2]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-[#17212d]" : "bg-[#e0e5eb]"}`} />
              {item}
            </div>
          ))}
        </aside>
        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="text-left">
              <h3 className="text-[13px] font-bold text-[#17212d]">Active Audits</h3>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#9aa4b1]">3 engagements currently screening</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="h-7 rounded-full bg-[#f0f2f5] px-4 text-[8px] font-bold uppercase tracking-[0.05em] text-[#9aa4b1] hover:bg-[#e9edf2]">
                Parse evidence
              </Button>
              <Button className="h-7 rounded-full bg-[#1d2836] px-4 text-[8px] font-bold uppercase tracking-[0.05em] text-white hover:bg-[#111820]">
                + Create audit
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[14px] border border-[#edf0f4]">
            <div className="grid grid-cols-[1.4fr_1.1fr_0.8fr_1fr] bg-[#fafbfc] px-4 py-3 text-left text-[8px] font-bold uppercase tracking-[0.1em] text-[#a0a9b6]">
              <span>Area</span>
              <span>Type</span>
              <span>AI score</span>
              <span>Status</span>
            </div>
            {candidates.map(([initial, name, role, score, status], index) => (
              <div key={name} className={`grid grid-cols-[1.4fr_1.1fr_0.8fr_1fr] items-center px-4 py-3 text-left text-[10px] ${index % 2 ? "bg-[#fbfcfd]" : "bg-white"}`}>
                <span className="flex items-center gap-2 font-semibold text-[#17212d]">
                  <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full border border-[#dfe4ea] bg-[#f3f5f7] text-[9px] text-[#9aa4b1]">
                    {initial}
                  </span>
                  {name}
                </span>
                <span className="text-[#6f7a8a]">{role}</span>
                <span className="font-bold text-[#17212d]">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#23c47b]" />
                  {score}
                </span>
                <span>
                  <span className={`rounded-full px-2 py-1 text-[7px] font-bold uppercase ${status === "DRAFT" ? "bg-[#f0f2f5] text-[#969fac]" : "bg-[#1d2836] text-white"}`}>
                    {status}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["127", "audit tests today"],
              ["84.3", "avg. readiness"],
              ["38hrs", "time saved"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[9px] border border-[#edf0f4] p-4 text-left">
                <p className="text-[16px] font-bold text-[#17212d]">{value}</p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0a9b6]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemsSection() {
  return (
    <section id="systems" className="bg-[#fbfcfd] px-5 py-20">
      <div className="mx-auto grid max-w-[915px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div id="scale" className="pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#a0a9b6]">Autonomous systems</p>
          <h2 className="mt-6 max-w-[350px] font-display text-[38px] font-medium leading-[1.15] tracking-normal text-[#17212d]">
            Audit work that <span className="text-[#a8b0bd]">reasons like you.</span>
          </h2>
          <p className="mt-7 max-w-[330px] text-[14px] leading-7 text-[#788393]">
            Stop chasing documents. Start building assurance. Auditly understands context, controls, evidence, and accountability at a human level.
          </p>
        </div>

        <div className="space-y-0">
          {systems.map((item) => (
            <article key={item.no} className="relative rounded-[28px] border border-[#f1f3f6] bg-white px-9 py-11 shadow-[0_20px_70px_rgba(15,23,42,0.05)]">
              <span className="flex h-[39px] w-[39px] items-center justify-center rounded-[12px] bg-[#fbfcfd] text-[#263241]">
                {item.no === "01" ? <FileCheck2 className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              </span>
              <span className="absolute right-9 top-9 text-[24px] font-black italic text-[#eef1f5]">{item.no}</span>
              <h3 className="mt-7 text-[20px] font-black uppercase tracking-[-0.06em] text-[#17212d]">{item.title}</h3>
              <p className="mt-4 max-w-[390px] text-[13px] leading-7 text-[#8a94a3]">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="support" className="bg-white px-5 pb-24 pt-14">
      <div className="mx-auto max-w-[530px] text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#a0a9b6]">Support</p>
        <h2 className="mt-2 font-display text-[27px] font-medium text-[#17212d]">FAQ</h2>
      </div>
      <div className="mx-auto mt-16 max-w-[530px] border-t border-[#edf0f4]">
        {faqs.map((faq) => (
          <details key={faq} className="group border-b border-[#edf0f4] py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between text-left text-[14px] font-black uppercase tracking-[-0.06em] text-[#0d1b2a]">
              {faq}
              <ChevronDown className="h-4 w-4 text-[#a0a9b6] transition group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-[13px] leading-7 text-[#7b8797]">
              Auditly centralizes responsibilities, deadlines, evidence, and review notes so teams can see what is blocking progress before reporting is late.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e5e9ee] bg-white px-5 py-24">
      <div className="mx-auto grid max-w-[1000px] gap-12 md:grid-cols-[1.5fr_0.55fr_0.55fr_0.55fr]">
        <div>
          <Link to="/" className="flex items-center gap-3 text-[15px] font-black text-black">
            <ShieldCheck className="h-4 w-4 text-[#6f7782]" />
            Auditly
          </Link>
          <p className="mt-6 max-w-[360px] text-[11px] leading-6 text-[#5f6b7a]">
            Autonomous audit intelligence for modern institutions. Build assurance faster, report smarter.
          </p>
          <div className="mt-6 flex gap-4 text-[#7a8492]">
            <Twitter className="h-4 w-4" />
            <Github className="h-4 w-4" />
          </div>
        </div>
        <FooterColumn title="Product" items={["Intelligence", "Scale", "Systems"]} />
        <FooterColumn title="Company" items={["Story", "Team"]} />
        <FooterColumn title="Resources" items={["Support"]} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#818b99]">{title}</p>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="block text-[12px] text-[#5f6b7a] hover:text-[#17212d]">
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}
