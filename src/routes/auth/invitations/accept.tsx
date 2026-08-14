import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { PRODUCT_LOGO } from "@/lib/auth-context";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/auth/invitations/accept")({
  head: () => ({ meta: [{ title: "Complete your profile · Auditly" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { token } = Route.useSearch();

  // Pre-filled from invitation
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  // User sets these
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [prefilling, setPrefilling] = React.useState(true);
  const [tokenError, setTokenError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token) { setPrefilling(false); return; }
    authApi.getInvitationInfo(token)
      .then((info) => {
        setEmail(info.email);
        setFullName(info.fullName);
        setPhone(info.phone);
      })
      .catch((err) => {
        setTokenError(err instanceof Error ? err.message : "This invitation link is invalid or has expired.");
      })
      .finally(() => setPrefilling(false));
  }, [token]);

  if (!token || tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid p-6">
        <div
          className="w-full max-w-md rounded-3xl border bg-white p-10 text-center"
          style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-100)" }}>
            <img src={PRODUCT_LOGO} alt="Auditly" className="h-7 w-7 object-contain" />
          </div>
          <h2 className="text-[20px] font-medium" style={{ color: "var(--brown-800)" }}>
            {!token ? "Invalid link" : "Invitation expired"}
          </h2>
          <p className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {!token
              ? "This invitation link is missing its token. Please use the link from your email."
              : tokenError}
          </p>
          <Button className="mt-6 w-full rounded-[10px]" onClick={() => navigate({ to: "/" })}>
            Go to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (prefilling) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)]">
        <Spinner size={28} />
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (password.length < 6) {
      setSubmitError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setSubmitError("Passwords do not match.");
      return;
    }

    // Split full name into firstName / lastName for the backend
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || firstName;

    setLoading(true);
    try {
      const data = await authApi.acceptInvitation({
        token,
        firstName,
        lastName,
        phone: phone || undefined,
        password,
      });
      setAuth(data.accessToken, data.refreshToken, data.user);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)] bg-dot-grid">
      {/* Left — brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 md:flex md:w-1/2"
        style={{ backgroundColor: "var(--brown-800)" }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white/95"
          >
            <img src={PRODUCT_LOGO} alt="Auditly" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-[16px] font-semibold text-white">Auditly</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight text-white">
            You've been invited<br />
            <span style={{ color: "var(--brown-200)" }}>to Auditly.</span>
          </h1>
          <p className="max-w-md text-[14px] leading-relaxed text-white/65">
            Confirm your details and set a password to activate your account.
          </p>
        </div>

        <p className="relative z-10 text-[11px] text-white/40">© 2026 Auditly · Nema Technologies</p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div
          className="w-full max-w-md rounded-3xl border bg-white p-10"
          style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" }}
        >
          <div className="data-label">Account setup</div>
          <h2 className="mt-2 text-[24px] font-medium tracking-tight" style={{ color: "var(--brown-800)" }}>
            Complete your profile
          </h2>
          <p className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
            Your details have been pre-filled. Set a password to activate your account.
          </p>
          <span
            className="mt-5 block h-[3px] w-16 rounded-sm"
            style={{ background: "linear-gradient(90deg, var(--brown-400), transparent)" }}
          />

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {/* Full name — pre-filled, editable */}
            <div>
              <Label htmlFor="fullName" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Full name
              </Label>
              <Input
                id="fullName"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Phone — pre-filled, editable */}
            <div>
              <Label htmlFor="phone" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Email — pre-filled, read-only */}
            <div>
              <Label htmlFor="email" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="cursor-not-allowed opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <Label htmlFor="confirm" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Confirm password
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {submitError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                {submitError}
              </p>
            )}

            <Button type="submit" className="h-[42px] w-full rounded-[10px]" disabled={loading}>
              {loading ? <Spinner size={16} invert /> : "Activate account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[12px]" style={{ color: "var(--text-hint)" }}>
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--brown-600)" }}
              onClick={() => navigate({ to: "/" })}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
