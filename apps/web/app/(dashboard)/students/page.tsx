"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCSV } from "@/components/shared/ExportCSV";
import { useToast } from "@/lib/use-toast";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";

const GRADES = ["Grade R","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];

interface Student {
  id: string; admissionNumber: string; grade: string; status: string;
  guardianName: string; guardianPhone: string;
  user: { name: string; email: string };
}

export default function StudentsPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [form, setForm] = useState({
    name: "", email: "", grade: "", gender: "", dateOfBirth: "",
    guardianName: "", guardianPhone: "", guardianEmail: "", address: "", notes: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = gradeFilter === "ALL" ? students : students.filter((s) => s.grade === gradeFilter);

  const columns: Column<Student>[] = [
    { key: "admissionNumber", label: "Adm. No" },
    { key: "user.name", label: "Name", render: (r) => r.user?.name },
    { key: "grade", label: "Grade" },
    { key: "guardianName", label: "Guardian" },
    { key: "guardianPhone", label: "Phone" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "", render: (r) => (
        <Link href={`/students/${r.id}`}>
          <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
        </Link>
      ),
    },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      toast({ title: "Student added successfully." });
      setOpen(false);
      setForm({ name: "", email: "", grade: "", gender: "", dateOfBirth: "", guardianName: "", guardianPhone: "", guardianEmail: "", address: "", notes: "" });
      load();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.length} learner${students.length !== 1 ? "s" : ""} registered`}
        actions={
          <div className="flex gap-2 items-center">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Grades</SelectItem>
                {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-1" />Add Student</Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="admissionNumber"
        loading={loading}
        onExport={() => exportToCSV(filtered.map((s) => ({
          "Adm No": s.admissionNumber, "Name": s.user?.name, "Grade": s.grade,
          "Guardian": s.guardianName, "Phone": s.guardianPhone, "Status": s.status,
        })), "students")}
        emptyMessage="No students found."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="col-span-2 space-y-2"><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Learner's full name" required /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="learner@school.co.za" required /></div>
            <div className="space-y-2"><Label>Grade *</Label>
              <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Guardian Name *</Label><Input value={form.guardianName} onChange={(e) => setForm((p) => ({ ...p, guardianName: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Guardian Phone *</Label><Input value={form.guardianPhone} onChange={(e) => setForm((p) => ({ ...p, guardianPhone: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Guardian Email</Label><Input type="email" value={form.guardianEmail} onChange={(e) => setForm((p) => ({ ...p, guardianEmail: e.target.value }))} /></div>
            <div className="col-span-2 space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></div>
            <div className="col-span-2 flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={saving} className="flex-1">{saving ? "Saving..." : "Add Student"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
