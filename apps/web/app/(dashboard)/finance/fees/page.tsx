"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useToast } from "@/lib/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, ToggleLeft } from "lucide-react";

interface FeeStructure {
  id: string; name: string; description?: string; amount: number;
  frequency: string; gradeLevel?: string; isActive: boolean;
}

export default function FeesPage() {
  const { toast } = useToast();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", amount: "", frequency: "QUARTERLY", gradeLevel: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/finance/fees");
    const data = await res.json();
    setFees(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/finance/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast({ title: "Fee structure created." });
      setOpen(false);
      setForm({ name: "", description: "", amount: "", frequency: "QUARTERLY", gradeLevel: "" });
      load();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/finance/fees`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !current }) });
      load();
    } catch { /* noop */ }
  };

  return (
    <div>
      <PageHeader title="Fee Structures" description="Manage school fee schedules" actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-1" />Add Fee Structure</Button>} />

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fees.map((fee) => (
            <div key={fee.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{fee.name}</p>
                  {fee.description && <p className="text-xs text-gray-500 mt-0.5">{fee.description}</p>}
                </div>
                <StatusBadge status={fee.isActive ? "ACTIVE" : "INACTIVE"} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#1A2340" }}>{formatCurrency(fee.amount)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fee.frequency} {fee.gradeLevel ? `· ${fee.gradeLevel}` : ""}</p>
                </div>
                <button onClick={() => toggleActive(fee.id, fee.isActive)} className="text-gray-400 hover:text-gray-600 p-1">
                  <ToggleLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {fees.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">No fee structures yet. Add your first one.</div>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Fee Structure</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Term 1 Fees" required /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Amount (ZAR) *</Label><Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Frequency *</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm((p) => ({ ...p, frequency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="ANNUAL">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Grade Level</Label><Input value={form.gradeLevel} onChange={(e) => setForm((p) => ({ ...p, gradeLevel: e.target.value }))} placeholder="e.g. Grade 4-7 (optional)" /></div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={saving} className="flex-1">{saving ? "Saving..." : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
