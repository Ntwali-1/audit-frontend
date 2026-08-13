import * as React from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Shell, State } from "./verify-email";

/**
 * The page the password-reset email links to. Like verify-email, this route did
 * not exist, so every reset link led to a 404.
 */
export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset your password · Auditly" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = useSearch({ from: "/auth/reset-password" });
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [done, setDone] = React.useState(false);

  const reset = useMutation({
    mutationFn: () =>
      apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      }),
    onSuccess: () => setDone(true),
  });

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = password.length >= 8 && password === confirm && !!token;

  if (!token) {
    return (
      <Shell>
        <State icon={XCircle} tone="bad" title="No reset token"
          body="This link is missing its token. Open the link from your email exactly as it was sent." />
        <Link to="/"><Button variant="outline" className="mt-5 w-full">Back to sign in</Button></Link>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <State icon={CheckCircle2} tone="good" title="Password updated"
          body="You can sign in with your new password now." />
        <Link to="/"><Button className="mt-5 w-full">Go to sign in</Button></Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-[18px] font-semibold" style={{ color: "var(--brown-800)" }}>
        Choose a new password
      </h1>
      <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
        At least 8 characters.
      </p>

      <form
        className="mt-5 space-y-3 text-left"
        onSubmit={(e) => { e.preventDefault(); reset.mutate(); }}
      >
        <div>
          <Label>New password</Label>
          <Input className="mt-1.5" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} autoFocus />
          {tooShort && <p className="mt-1 text-[12px]" style={{ color: "#9B2C2C" }}>Too short.</p>}
        </div>
        <div>
          <Label>Confirm password</Label>
          <Input className="mt-1.5" type="password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} />
          {mismatch && <p className="mt-1 text-[12px]" style={{ color: "#9B2C2C" }}>Passwords do not match.</p>}
        </div>

        {reset.error && (
          <p className="rounded-lg border px-3 py-2 text-[12px]"
            style={{ borderColor: "#F5B5B5", backgroundColor: "#FDECEC", color: "#9B2C2C" }}>
            {(reset.error as Error).message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={!canSubmit || reset.isPending}>
          {reset.isPending ? <Spinner size={14} invert /> : "Update password"}
        </Button>
      </form>

      <Link to="/">
        <Button variant="outline" className="mt-3 w-full">Back to sign in</Button>
      </Link>
    </Shell>
  );
}
