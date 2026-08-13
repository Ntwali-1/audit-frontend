import { createFileRoute } from "@tanstack/react-router";
import { FilingsInbox } from "@/components/filings-inbox";

export const Route = createFileRoute("/oag/submissions")({
  head: () => ({ meta: [{ title: "Filings received · Auditly" }] }),
  component: () => <FilingsInbox office="OAG" />,
});
