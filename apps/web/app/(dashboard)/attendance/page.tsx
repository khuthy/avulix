"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/lib/use-toast";
import { CheckCircle, XCircle, Clock, FileCheck } from "lucide-react";

const GRADES = ["Grade R","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];
const STATUSES = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;
type AttStatus = typeof STATUSES[number];

const statusIcons: Record<AttStatus, React.ElementType> = { PRESENT: CheckCircle, ABSENT: XCircle, LATE: Clock, EXCUSED: FileCheck };
const statusColors: Record<AttStatus, string> = { PRESENT: "#8DB531", ABSENT: "#C0392B", LATE: "#F59E0B", EXCUSED: "#3B82F6" };

interface Student { id: string; admissionNumber: string; grade: string; user: { name: string }; }
interface AttRecord { studentId: string; status: AttStatus; note?: string; }

export default function AttendancePage() {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [grade, setGrade] = useState(GRADES[3]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isToday = date === new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/students?grade=${encodeURIComponent(grade)}`);
        const data = await res.json();
        setStudents(data.data ?? []);
        // Load existing attendance
        const attRes = await fetch(`/api/attendance?date=${date}&grade=${encodeURIComponent(grade)}`);
        const attData = await attRes.json();
        const map: Record<string, AttStatus> = {};
        for (const r of (attData.data ?? []) as AttRecord[]) {
          map[r.studentId] = r.status;
        }
        // Default unrecorded to PRESENT
        for (const s of (data.data ?? [])) {
          if (!map[s.id]) map[s.id] = "PRESENT";
        }
        setAttendance(map);
      } finally { setLoading(false); }
    };
    loadStudents();
  }, [grade, date]);

  const present = Object.values(attendance).filter((s) => s === "PRESENT").length;
  const absent = Object.values(attendance).filter((s) => s === "ABSENT").length;
  const late = Object.values(attendance).filter((s) => s === "LATE").length;

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({ studentId: s.id, status: attendance[s.id] ?? "PRESENT", date }));
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: `Attendance saved for ${formatDate(date)}.` });
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader title="Attendance" description={formatDate(date)} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C0392B]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Grade:</label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {/* Summary */}
        <div className="flex gap-4 ml-auto text-sm font-medium">
          <span style={{ color: "#8DB531" }}>{present} Present</span>
          <span style={{ color: "#C0392B" }}>{absent} Absent</span>
          <span style={{ color: "#F59E0B" }}>{late} Late</span>
        </div>
        {isToday && (
          <Button onClick={saveAttendance} disabled={saving || students.length === 0}>
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        )}
      </div>

      {/* Student list */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No students in {grade}.</div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => {
            const current = attendance[s.id] ?? "PRESENT";
            return (
              <div key={s.id} className="bg-white rounded-xl border px-5 py-3 flex items-center gap-4 shadow-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#1A2340" }}>
                  {s.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{s.user.name}</p>
                  <p className="text-xs text-gray-400">{s.admissionNumber}</p>
                </div>
                <div className="flex gap-2">
                  {STATUSES.map((status) => {
                    const Icon = statusIcons[status];
                    const isActive = current === status;
                    return (
                      <button
                        key={status}
                        disabled={!isToday}
                        onClick={() => isToday && setAttendance((prev) => ({ ...prev, [s.id]: status }))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                        style={{
                          backgroundColor: isActive ? statusColors[status] + "20" : "transparent",
                          borderColor: isActive ? statusColors[status] : "#E2E4EA",
                          color: isActive ? statusColors[status] : "#9DA3B4",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
