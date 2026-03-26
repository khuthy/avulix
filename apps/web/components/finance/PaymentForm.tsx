"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/lib/use-toast";

interface Student { id: string; name: string; admissionNumber: string; }
interface FeeStructure { id: string; name: string; amount: number; }

interface PaymentFormProps {
  students: Student[];
  feeStructures: FeeStructure[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ students, feeStructures, onSuccess, onCancel }: PaymentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    feeStructureId: "",
    amount: "",
    method: "",
    reference: "",
    note: "",
  });

  const selectedFee = feeStructures.find((f) => f.id === form.feeStructureId);

  const handleFeeChange = (id: string) => {
    const fee = feeStructures.find((f) => f.id === id);
    setForm((prev) => ({ ...prev, feeStructureId: id, amount: fee ? String(fee.amount) : "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.feeStructureId || !form.amount || !form.method) {
      toast({ title: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast({ title: "Payment recorded successfully.", variant: "default" });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record payment";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Student *</Label>
        <Select value={form.studentId} onValueChange={(v) => setForm((p) => ({ ...p, studentId: v }))}>
          <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fee Structure *</Label>
        <Select value={form.feeStructureId} onValueChange={handleFeeChange}>
          <SelectTrigger><SelectValue placeholder="Select fee" /></SelectTrigger>
          <SelectContent>
            {feeStructures.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name} (R{f.amount})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Amount (ZAR) *</Label>
        <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
      </div>

      <div className="space-y-2">
        <Label>Payment Method *</Label>
        <Select value={form.method} onValueChange={(v) => setForm((p) => ({ ...p, method: v }))}>
          <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="EFT">EFT</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BURSARY">Bursary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Reference / Proof of Payment</Label>
        <Input value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} placeholder="e.g. EFT ref number" />
      </div>

      <div className="space-y-2">
        <Label>Note</Label>
        <Input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="Optional note" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-1">{loading ? "Recording..." : "Record Payment"}</Button>
      </div>
    </form>
  );
}
