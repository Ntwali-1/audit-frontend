import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck, Building2, UserCog, UsersRound, CheckCircle2,
  ArrowLeft, ArrowRight, Plus, X, Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  registrationApi, ORG_TYPE_LABEL,
  type OrganizationType, type RegisterInstitutionPayload,
} from "@/lib/api-portals";
import { isPublicBody, COAT_OF_ARMS, PRODUCT_LOGO } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register your institution · Auditly" },
      { name: "description", content: "Bring your institution's internal audit programme onto Auditly." },
    ],
  }),
  component: RegisterInstitution,
});

/** Only institutions register. OAG and OCIA are national offices, not applicants. */
const REGISTRABLE_TYPES: OrganizationType[] = [
  "GOVERNMENT_DISTRICT",
  "GOVERNMENT_INSTITUTION",
  "PRIVATE_COMPANY",
];

type TeamRow = { email: string; fullName: string; role: "AUDITOR" | "LEAD_AUDITOR" };

const STEPS = [
  { id: 0, label: "Institution", icon: Building2, hint: "Who you are" },
  { id: 1, label: "Your account", icon: UserCog, hint: "Who is registering" },
  { id: 2, label: "Audit team", icon: UsersRound, hint: "Who you work with" },
  { id: 3, label: "Review", icon: CheckCircle2, hint: "Check and submit" },
];

function RegisterInstitution() {
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState<{ message: string; invites: number } | null>(null);

  // Step 1
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<OrganizationType | "">("");
  const [district, setDistrict] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

  // Step 2
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  // Step 3
  const [team, setTeam] = React.useState<TeamRow[]>([]);

  const payload: RegisterInstitutionPayload = {
    institution: {
      name: name.trim(),
      type: type as OrganizationType,
      ...(district ? { district } : {}),
      ...(contactEmail ? { contactEmail } : {}),
      ...(contactPhone ? { contactPhone } : {}),
      ...(address ? { address } : {}),
    },
    registrant: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      ...(jobTitle ? { jobTitle } : {}),
      ...(phone ? { phone } : {}),
    },
    ...(team.length > 0
      ? {
          team: team
            .filter((t) => t.email.trim())
            .map((t) => ({
              email: t.email.trim().toLowerCase(),
              ...(t.fullName ? { fullName: t.fullName } : {}),
              role: t.role,
            })),
        }
      : {}),
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => registrationApi.registerInstitution(payload),
    onSuccess: (res) =>
      setSubmitted({ message: res.message, invites: res.teamInvitesQueued }),
    onError: (e) => toast.error("Could not submit", { description: (e as Error).message }),
  });

  const stepValid = [
    name.trim().length >= 2 && !!type,
    firstName.trim() && lastName.trim() && /\S+@\S+\.\S+/.test(email) &&
      password.length >= 8 && password === confirm,
    true, // the team step is optional
    true,
  ][step];

  if (submitted) {
    return <SubmittedScreen message={submitted.message} invites={submitted.invites} />;
  }

  return (
    <div className="min-h-screen bg-[color:var(--cream)] bg-dot-grid">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Switches to the national crest as soon as a public type is
                chosen, so the applicant sees which world they are entering. */}
            <img
              src={isPublicBody(type || undefined) ? COAT_OF_ARMS : PRODUCT_LOGO}
              alt={isPublicBody(type || undefined) ? "Republic of Rwanda" : "Auditly"}
              className="h-6 w-6 object-contain"
            />
            <span className="text-[15px] font-semibold" style={{ color: "var(--brown-800)" }}>Auditly</span>
          </div>
          <Link to="/login" className="text-[13px] hover:underline" style={{ color: "var(--text-muted)" }}>
            Already registered? Sign in
          </Link>
        </header>

        <div className="mb-2">
          <h1 className="text-[26px] font-semibold leading-tight" style={{ color: "var(--brown-800)" }}>
            Register your institution
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
            Takes about two minutes. We review every application before it goes live.
          </p>
        </div>

        <Stepper current={step} onJump={(i) => i < step && setStep(i)} />

        <div className="mt-6 flex-1 rounded-2xl border bg-white p-6"
          style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
          {step === 0 && (
            <Section title="About the institution"
              blurb="Enough for us to confirm you are who you say you are.">
              <Field label="Institution name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Nyaruka District" />
              </Field>
              <Field label="Type" required>
                <Select value={type} onValueChange={(v) => setType(v as OrganizationType)}>
                  <SelectTrigger><SelectValue placeholder="Choose a type…" /></SelectTrigger>
                  <SelectContent>
                    {REGISTRABLE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{ORG_TYPE_LABEL[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {type === "PRIVATE_COMPANY" && (
                  <Note>
                    Private organizations run the full audit programme, but have no statutory
                    obligation to file yearly reports with OAG or OCIA.
                  </Note>
                )}
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="District or province">
                  <Input value={district} onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Eastern Province" />
                </Field>
                <Field label="Official phone">
                  <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+250 788 000 000" />
                </Field>
              </div>
              <Field label="Official email">
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="info@nyaruka.gov.rw" />
              </Field>
              <Field label="Address">
                <Input value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="KG 11 Ave, Kigali" />
              </Field>
            </Section>
          )}

          {step === 1 && (
            <Section title="Your account"
              blurb="You become the institution's first audit manager and can invite everyone else.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" required>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Field>
                <Field label="Last name" required>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Field>
              </div>
              <Field label="Work email" required>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="claire@nyaruka.gov.rw" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job title">
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Head of Internal Audit" />
                </Field>
                <Field label="Phone">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Password" required>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {password.length > 0 && password.length < 8 && (
                    <Warn>At least 8 characters.</Warn>
                  )}
                </Field>
                <Field label="Confirm password" required>
                  <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                  {confirm.length > 0 && confirm !== password && <Warn>Passwords do not match.</Warn>}
                </Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Your audit team"
              blurb="Optional. Everyone you add is invited automatically the moment your institution is approved — no email goes out before then.">
              <TeamEditor team={team} setTeam={setTeam} />
            </Section>
          )}

          {step === 3 && (
            <Section title="Check and submit"
              blurb="Nothing is live yet. We review the application and email you the outcome.">
              <Review label="Institution" rows={[
                ["Name", name],
                ["Type", type ? ORG_TYPE_LABEL[type] : "—"],
                ["District", district || "—"],
                ["Official email", contactEmail || "—"],
                ["Phone", contactPhone || "—"],
                ["Address", address || "—"],
              ]} />
              <Review label="You" rows={[
                ["Name", `${firstName} ${lastName}`.trim()],
                ["Email", email],
                ["Job title", jobTitle || "—"],
                ["Role", "Audit Manager"],
              ]} />
              <Review label={`Audit team (${team.length})`} rows={
                team.length === 0
                  ? [["", "None — you can invite people once you are in."]]
                  : team.map((t) => [t.email, t.role === "LEAD_AUDITOR" ? "Lead Auditor" : "Auditor"])
              } />
              {error && (
                <p className="rounded-lg border px-3 py-2 text-[13px]"
                  style={{ borderColor: "#F5B5B5", backgroundColor: "#FDECEC", color: "#9B2C2C" }}>
                  {(error as Error).message}
                </p>
              )}
            </Section>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!stepValid}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => mutate()} disabled={isPending}>
              {isPending ? <><Spinner size={14} invert /> <span className="ml-2">Submitting…</span></> : "Submit application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <div className="mt-6 flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.id}>
            <button
              onClick={() => onJump(i)}
              disabled={i >= current}
              className="flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition disabled:cursor-default"
              style={{
                borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
                backgroundColor: active ? "var(--brown-50)" : done ? "#E6F4ED" : "transparent",
              }}
            >
              <s.icon className="h-4 w-4 shrink-0"
                style={{ color: active ? "var(--brown-800)" : done ? "#1A6638" : "var(--text-hint)" }} />
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-[12px] font-medium"
                  style={{ color: active || done ? "var(--brown-800)" : "var(--text-muted)" }}>
                  {s.label}
                </span>
                <span className="block truncate text-[10px]" style={{ color: "var(--text-hint)" }}>
                  {s.hint}
                </span>
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1"
                style={{ backgroundColor: i < current ? "#A8D5BA" : "var(--border-subtle)" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TeamEditor({ team, setTeam }: { team: TeamRow[]; setTeam: (t: TeamRow[]) => void }) {
  const add = () => setTeam([...team, { email: "", fullName: "", role: "AUDITOR" }]);
  const update = (i: number, patch: Partial<TeamRow>) =>
    setTeam(team.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => setTeam(team.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {team.length === 0 && (
        <p className="rounded-lg border px-3 py-3 text-[13px]"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          No team members yet. You can skip this and invite people later.
        </p>
      )}

      {team.map((row, i) => (
        <div key={i} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[1.4fr_1fr_auto_auto]"
          style={{ borderColor: "var(--border-subtle)" }}>
          <Input placeholder="eric@nyaruka.gov.rw" value={row.email}
            onChange={(e) => update(i, { email: e.target.value })} />
          <Input placeholder="Full name (optional)" value={row.fullName}
            onChange={(e) => update(i, { fullName: e.target.value })} />
          <Select value={row.role} onValueChange={(v) => update(i, { role: v as TeamRow["role"] })}>
            <SelectTrigger className="min-w-[9.5rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="AUDITOR">Auditor</SelectItem>
              <SelectItem value="LEAD_AUDITOR">Lead Auditor</SelectItem>
            </SelectContent>
          </Select>
          <button onClick={() => remove(i)}
            className="flex h-9 w-9 items-center justify-center self-center rounded-lg hover:bg-red-50"
            style={{ color: "var(--text-muted)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button variant="outline" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Add team member
      </Button>
    </div>
  );
}

function SubmittedScreen({ message, invites }: { message: string; invites: number }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid px-5">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center"
        style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#FEF3E2" }}>
          <Clock className="h-6 w-6" style={{ color: "#854F0B" }} />
        </span>
        <h1 className="mt-4 text-[20px] font-semibold" style={{ color: "var(--brown-800)" }}>
          Application submitted
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: "var(--text-muted)" }}>{message}</p>

        <div className="mt-5 space-y-2 rounded-xl border p-4 text-left text-[13px]"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <p className="font-medium" style={{ color: "var(--brown-800)" }}>What happens next</p>
          <p>1. We check the institution details against public records.</p>
          <p>2. You get an email once it is approved, and can sign in straight away.</p>
          <p>
            3. {invites > 0
              ? `Your ${invites} team invitation${invites === 1 ? "" : "s"} go out at the same moment — not before.`
              : "You can invite your audit team from inside the app."}
          </p>
        </div>

        <Link to="/login">
          <Button variant="outline" className="mt-6">Back to sign in</Button>
        </Link>
      </div>
    </div>
  );
}

function Section({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[16px] font-semibold" style={{ color: "var(--brown-800)" }}>{title}</h2>
      <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>{blurb}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label>
        {label}
        {required && <span style={{ color: "#9B2C2C" }}> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-lg border px-3 py-2 text-[12px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[12px]" style={{ color: "#9B2C2C" }}>{children}</p>;
}

function Review({ label, rows }: { label: string; rows: (string | number)[][] }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
      <p className="mb-2 text-[12px] font-medium uppercase tracking-wide" style={{ color: "var(--text-hint)" }}>
        {label}
      </p>
      <div className="space-y-1.5">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex gap-3 text-[13px]">
            <span className="w-36 shrink-0" style={{ color: "var(--text-muted)" }}>{k}</span>
            <span className="min-w-0 flex-1 break-words" style={{ color: "var(--brown-800)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
