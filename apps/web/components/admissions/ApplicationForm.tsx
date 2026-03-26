"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/lib/use-toast";

const GRADES = ["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

interface ApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ApplicationForm({ onSuccess, onCancel }: ApplicationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicantName: "", grade: "", gender: "", parentName: "",
    parentEmail: "", parentPhone: "", address: "", previousSchool: "", notes: "",
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName || !form.grade || !form.parentName || !form.parentEmail || !form.parentPhone) {
      toast({ title: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast({ title: "Application submitted successfully." });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Applicant Full Name *</Label>
          <Input value={form.applicantName} onChange={(e) => set("applicantName", e.target.value)} placeholder="Learner's full name" />
        </div>
        <div className="space-y-2">
          <Label>Grade Applying For *</Label>
          <Select value={form.grade} onValueChange={(v) => set("grade", v)}>
            <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
            <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Parent / Guardian Name *</Label>
          <Input value={form.parentName} onChange={(e) => set("parentName", e.target.value)} placeholder="Full name" />
        </div>
        <div className="space-y-2">
          <Label>Parent Email *</Label>
          <Input type="email" value={form.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="space-y-2">
          <Label>Parent Phone *</Label>
          <Input value={form.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} placeholder="e.g. 073 000 0000" />
        </div>
        <div className="space-y-2">
          <Label>Previous School</Label>
          <Input value={form.previousSchool} onChange={(e) => set("previousSchool", e.target.value)} placeholder="Name of previous school" />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Home address" />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Notes</Label>
          <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any additional information" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-1">{loading ? "Submitting..." : "Submit Application"}</Button>
      </div>
    </form>
  );
}
