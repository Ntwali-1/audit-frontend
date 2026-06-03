import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { VENDORS as SEED_VENDORS } from "@/lib/audit-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, ShieldAlert, FileText, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendors")({
  head: () => ({ meta: [{ title: "Vendors · Auditly" }] }),
  component: VendorsPage,
});

type Vendor = {
  id: string;
  name: string;
  category: string;
  risk: "critical" | "high" | "medium" | "low";
  contracts: number;
  lastReview: string;
  status: string;
};

const STORAGE_KEY = "auditly:vendors";

function loadVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_VENDORS as Vendor[];
}

function saveVendors(vendors: Vendor[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors)); } catch {}
}

const riskTone: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  low: "bg-stone-100 text-stone-600 border-stone-200",
};

type VendorModal =
  | { type: "create" }
  | { type: "edit"; vendor: Vendor }
  | { type: "delete"; vendor: Vendor }
  | null;

function VendorsPage() {
  const [vendors, setVendors] = React.useState<Vendor[]>(() => loadVendors());
  const [modal, setModal] = React.useState<VendorModal>(null);

  const persist = (updated: Vendor[]) => {
    setVendors(updated);
    saveVendors(updated);
  };

  const handleSave = (data: Omit<Vendor, "id">, id?: string) => {
    if (id) {
      persist(vendors.map((v) => (v.id === id ? { ...data, id } : v)));
    } else {
      const newVendor: Vendor = { ...data, id: `V-${Date.now()}` };
      persist([...vendors, newVendor]);
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    persist(vendors.filter((v) => v.id !== id));
    setModal(null);
  };

  const byRisk = vendors.reduce<Record<string, number>>((acc, v) => ((acc[v.risk] = (acc[v.risk] ?? 0) + 1), acc), {});

  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Vendors"
        description="Third-party vendor registry with risk classification."
        actions={
          <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setModal({ type: "create" })}>
            <Plus className="mr-2 h-4 w-4" /> Register vendor
          </Button>
        }
      />

      {/* Note: vendor data is managed locally (no backend model yet) */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--brown-50)" }}>
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        Vendor data is stored locally in this browser. Backend integration is pending.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total" value={vendors.length} icon={Building2} tone={1} />
        <StatTile label="Critical risk" value={byRisk.critical ?? 0} icon={ShieldAlert} tone={5} />
        <StatTile label="High risk" value={byRisk.high ?? 0} icon={ShieldAlert} tone={2} />
        <StatTile label="Contracts" value={vendors.reduce((s, v) => s + v.contracts, 0)} icon={FileText} tone={4} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vendors.map((v) => (
          <div key={v.id} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground">{v.id}</p>
                <h3 className="mt-1 truncate text-lg font-semibold">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.category}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider", riskTone[v.risk])}>
                  {v.risk}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal({ type: "edit", vendor: v })}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setModal({ type: "delete", vendor: v })}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contracts</p>
                <p className="mt-0.5 text-sm font-semibold">{v.contracts}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last review</p>
                <p className="mt-0.5 text-[11px] font-mono">{v.lastReview}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="mt-0.5 text-sm font-semibold capitalize">{v.status}</p>
              </div>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No vendors yet</p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>Register your first vendor to start tracking.</p>
          </div>
        )}
      </div>

      {(modal?.type === "create" || modal?.type === "edit") && (
        <VendorFormModal
          vendor={modal.type === "edit" ? modal.vendor : undefined}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "delete" && (
        <Dialog open onOpenChange={(o) => !o && setModal(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Delete vendor</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">
              Remove <strong>{modal.vendor.name}</strong> from your registry? This cannot be undone.
            </p>
            <DialogFooter className="gap-2">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button variant="destructive" onClick={() => handleDelete(modal.vendor.id)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

function VendorFormModal({ vendor, onSave, onClose }: {
  vendor?: Vendor;
  onSave: (data: Omit<Vendor, "id">, id?: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(vendor?.name ?? "");
  const [category, setCategory] = React.useState(vendor?.category ?? "");
  const [risk, setRisk] = React.useState<Vendor["risk"]>(vendor?.risk ?? "medium");
  const [contracts, setContracts] = React.useState(String(vendor?.contracts ?? "0"));
  const [lastReview, setLastReview] = React.useState(vendor?.lastReview ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = React.useState(vendor?.status ?? "active");

  const handleSubmit = () => {
    onSave({ name, category, risk, contracts: parseInt(contracts) || 0, lastReview, status }, vendor?.id);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit vendor" : "Register vendor"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Vendor name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="e.g. Northwind Holdings" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5" placeholder="e.g. Financial services" />
          </div>
          <div>
            <Label>Risk level</Label>
            <Select value={risk} onValueChange={(v) => setRisk(v as Vendor["risk"])}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Active contracts</Label>
            <Input type="number" min={0} value={contracts} onChange={(e) => setContracts(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Last review date</Label>
            <Input type="date" value={lastReview} onChange={(e) => setLastReview(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {vendor ? "Save changes" : "Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
