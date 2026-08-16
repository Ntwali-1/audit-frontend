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

const demoSlides = [
  { src: "/dashboard.png", alt: "Audit dashboard overview" },
  { src: "/assistant.png", alt: "Audit assistant chat interface" },
  { src: "/register.png", alt: "Registration flow" },
  { src: "/login.png", alt: "Login screen" },
];

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
    variant: "intake",
  },
  {
    no: "02",
    title: "NEURAL EVIDENCE FLOW",
    text: "Connect teams, evidence folders, submissions, and conversations into one clear review trail.",
    variant: "evidence",
  },
  {
    no: "03",
    title: "AUTONOMOUS FINDINGS",
    text: "Issues are tracked in real time. Only verified findings reach managers with the context they need.",
    variant: "findings",
  },
  {
    no: "04",
    title: "SMART REPORTING",
    text: "Auditly prepares clean report packets and highlights gaps before oversight submissions are due.",
    variant: "reporting",
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
    <section id="intelligence" className="relative overflow-hidden bg-[#f7f8fa] pb-20 pt-28 sm:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="absolute left-[-10%] top-12 h-[520px] w-[55%] rounded-[32px] bg-gradient-to-br from-[#eef1f4] via-[#f7f8fa] to-transparent blur-[2px]" />
        <div className="absolute right-[-6%] top-20 h-[380px] w-[50%] rounded-full bg-gradient-to-r from-[#eef3f8] via-[#f9fafb] to-[#edf1f5] shadow-[0_30px_80px_rgba(15,23,42,0.08)]" />
        <div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent via-white/75 to-white" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 px-5 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-[560px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e2e8ef] bg-white/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b7788] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <span className="h-2 w-2 rounded-full bg-[#16212f]" />
            Autonomous audit intelligence
          </div>

          <h1 className="mt-7 font-display text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] text-[#17212d] sm:text-[60px] lg:text-[72px]">
            Audit with
            <span className="mt-2 block text-[#abb4c0]">clarity.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-[#667385] sm:text-[19px]">
            Auditly turns fragmented evidence, risk indicators, and reporting tasks into one intelligent workflow designed for modern institutions.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <Button asChild className="h-[46px] min-w-[184px] rounded-full bg-[#141b22] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] hover:bg-[#0d1218]">
              <Link to="/register">Begin onboarding</Link>
            </Button>
            <Button asChild variant="outline" className="h-[46px] min-w-[188px] rounded-full border-[#e7ebef] bg-white/90 px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#374152] shadow-[0_10px_25px_rgba(15,23,42,0.06)] hover:bg-white hover:text-[#111820]">
              <a href="#story">Watch intelligence</a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8794]">
            {[
              "Evidence flow",
              "Risk detection",
              "Board reporting",
            ].map((item) => (
              <span key={item} className="rounded-full border border-[#e8edf2] bg-white/80 px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[700px]">
          <div className="absolute -left-4 top-10 hidden h-20 w-20 rounded-2xl border border-[#e7edf4] bg-white/85 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:block">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#f4f7f9] text-[#152230]">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>

          <div className="absolute -right-3 bottom-8 hidden rounded-2xl border border-[#edf1f5] bg-white/90 px-4 py-3 shadow-[0_24px_50px_rgba(15,23,42,0.08)] sm:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a96a7]">Readiness</p>
            <p className="mt-2 text-2xl font-black tracking-[-0.06em] text-[#171f2a]">94%</p>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[#e7edf3] bg-white shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
            <div className="flex h-[42px] items-center gap-2 border-b border-[#edf1f5] bg-[#fafbfc] px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff8b8b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f7cf62]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#6ecf80]" />
              <div className="ml-3 h-[18px] flex-1 rounded-full border border-[#e5e9ee] bg-white px-3 text-left text-[9px] leading-[18px] text-[#c1c8d0]">
                app.auditly.ai/portfolio
              </div>
            </div>

            <div className="overflow-hidden bg-[#f2f4f6]">
              <img
                src="/dashboard.png"
                alt="Auditly dashboard"
                className="h-[440px] w-full object-cover object-center scale-[1.04]"
              />
            </div>
          </div>
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
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % demoSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[22px]">
      <div className="flex h-[38px] items-center gap-2 border-b border-[#edf0f4] bg-[#fafbfc] px-4">
        <span className="h-9 w-9" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff8f8f]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f8d65d]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#70d88c]" />
        <div className="ml-4 h-[18px] flex-1 rounded-full border border-[#e5e9ee] bg-white px-3 text-left text-[9px] leading-[18px] text-[#c8ced7]">
          app.auditly.ai/{demoSlides[activeIndex].alt.toLowerCase().replace(/\s+/g, "-")}
        </div>
      </div>

      <div className="relative">
        <div className="relative h-[410px] overflow-hidden bg-[#f7f8fa]">
          {demoSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ${
                index === activeIndex ? "translate-x-0 opacity-100" : index < activeIndex ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {demoSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-[#111827]" : "w-2.5 bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderSystemPreview(variant: string) {
  const sharedFrame =
    "relative h-full overflow-hidden rounded-[18px] border border-[#edf1f5] bg-[#f9fafb] p-3 shadow-[0_16px_28px_rgba(15,23,42,0.06)]";

  if (variant === "assistant") {
    return (
      <div className={sharedFrame}>
        <div className="flex h-full flex-col rounded-[14px] bg-[#f3f4f6] p-2">
          <div className="flex items-center gap-2 border-b border-[#e6eaee] pb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1e1f22]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d9dfe6]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d9dfe6]" />
          </div>
          <div className="mt-2 flex-1 space-y-2">
            <div className="rounded-xl bg-white p-2 text-[8px] leading-4 text-[#4b5563] shadow-sm">
              Which audits are overdue this month?
            </div>
            <div className="ml-3 rounded-xl bg-[#111827] px-2 py-1.5 text-[8px] font-medium text-white">
              Show me all critical findings...
            </div>
            <div className="rounded-xl bg-white p-2 text-[8px] leading-4 text-[#4b5563] shadow-sm">
              Based on your workspace data, there are currently no audits recorded in the system.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "evidence") {
    return (
      <div className={sharedFrame}>
        <div className="flex h-full rounded-[14px] bg-[#fafafb] p-2">
          <aside className="w-[26%] rounded-[10px] bg-[#111827] p-2 text-[7px] text-white/80">
            <div className="mb-3 h-5 w-10 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-2.5 rounded bg-white/10" />
              <div className="h-2.5 rounded bg-white/10" />
              <div className="h-2.5 rounded bg-white/10" />
            </div>
          </aside>
          <div className="ml-2 flex-1 space-y-2">
            <div className="flex items-center justify-between rounded-[10px] bg-white px-2 py-2 shadow-sm">
              <div>
                <div className="h-2.5 w-16 rounded bg-[#dfe5ea]" />
                <div className="mt-2 h-2 w-10 rounded bg-[#edf1f5]" />
              </div>
              <div className="h-6 w-6 rounded-full bg-[#111827]" />
            </div>
            <div className="rounded-[10px] bg-white p-2 shadow-sm">
              <div className="mb-2 h-2.5 w-20 rounded bg-[#e5e7eb]" />
              <div className="space-y-1.5">
                <div className="h-2 rounded bg-[#eef2f5]" />
                <div className="h-2 rounded bg-[#eef2f5]" />
                <div className="h-2 rounded bg-[#eef2f5]" />
                <div className="h-2 rounded bg-[#eef2f5]" />
              </div>
            </div>
            <div className="rounded-[10px] bg-[#eef4f6] p-2 shadow-sm">
              <div className="h-2.5 w-16 rounded bg-[#d8e3ea]" />
              <div className="mt-2 h-2 w-14 rounded bg-[#cfe0ea]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "findings") {
    return (
      <div className={sharedFrame}>
        <div className="flex h-full flex-col rounded-[14px] bg-[#f5f6f8] p-2">
          <div className="rounded-[10px] bg-white p-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-20 rounded bg-[#dfe5ea]" />
              <div className="h-5 w-12 rounded-full bg-[#ecfdf5]" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-8 rounded bg-[#eef2f5]" />
              <div className="h-8 rounded bg-[#eef2f5]" />
              <div className="h-8 rounded bg-[#eef2f5]" />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-[10px] bg-[#111827] p-2 text-[7px] text-white">
              <div className="mb-2 h-2.5 w-12 rounded bg-white/20" />
              <div className="h-2 rounded bg-white/10" />
            </div>
            <div className="rounded-[10px] bg-white p-2 shadow-sm">
              <div className="mb-2 h-2.5 w-12 rounded bg-[#e5e7eb]" />
              <div className="h-2 rounded bg-[#eef2f5]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={sharedFrame}>
      <div className="flex h-full flex-col rounded-[14px] bg-[#f7f8fa] p-2">
        <div className="mb-2 flex items-center justify-between rounded-[10px] bg-white p-2 shadow-sm">
          <div className="h-2.5 w-16 rounded bg-[#dfe5ea]" />
          <div className="h-5 w-5 rounded-full bg-[#111827]" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="rounded-[10px] bg-white p-2 shadow-sm">
            <div className="mb-2 h-2.5 w-12 rounded bg-[#e5e7eb]" />
            <div className="h-14 rounded bg-[#eef2f5]" />
          </div>
          <div className="rounded-[10px] bg-[#111827] p-2 text-white shadow-sm">
            <div className="mb-2 h-2.5 w-12 rounded bg-white/15" />
            <div className="h-14 rounded bg-white/10" />
          </div>
        </div>
        <div className="mt-2 rounded-[10px] bg-white p-2 shadow-sm">
          <div className="h-2.5 w-20 rounded bg-[#e5e7eb]" />
          <div className="mt-2 h-2 rounded bg-[#eef2f5]" />
        </div>
      </div>
    </div>
  );
}

function SystemsSection() {
  return (
    <section id="systems" className="bg-[#fbfcfd] px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div id="scale" className="pt-4 lg:sticky lg:top-24 lg:pb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#a0a9b6]">Autonomous systems</p>
          <h2 className="mt-6 max-w-[330px] font-display text-[38px] font-medium leading-[1.12] tracking-normal text-[#17212d]">
            Audit work that <span className="text-[#a8b0bd]">reasons like you.</span>
          </h2>
          <p className="mt-7 max-w-[330px] text-[14px] leading-7 text-[#788393]">
            Stop chasing documents. Start building assurance. Auditly understands context, controls, evidence, and accountability at a human level.
          </p>
        </div>

        <div className="lg:max-h-[620px] lg:overflow-y-auto lg:pr-2">
          <div className="space-y-[-26px]">
            {systems.map((item, index) => (
              <article
                key={item.no}
                className={`relative rounded-[28px] border border-[#f1f3f6] bg-white px-5 py-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_76px_rgba(15,23,42,0.09)] lg:px-7 lg:py-7 ${index > 0 ? "-mt-[26px]" : ""}`}
              >
                <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                  <div>
                    <span className="flex h-[39px] w-[39px] items-center justify-center rounded-[12px] bg-[#fbfcfd] text-[#263241]">
                      {item.no === "01" ? <FileCheck2 className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                    </span>
                    <span className="mt-5 block text-[24px] font-black italic text-[#eef1f5]">{item.no}</span>
                    <h3 className="mt-3 text-[20px] font-black uppercase tracking-[-0.06em] text-[#17212d]">{item.title}</h3>
                    <p className="mt-3 max-w-[390px] text-[13px] leading-7 text-[#8a94a3]">{item.text}</p>
                  </div>

                  <div className="min-h-[200px]">{renderSystemPreview(item.variant)}</div>
                </div>
              </article>
            ))}
          </div>
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
