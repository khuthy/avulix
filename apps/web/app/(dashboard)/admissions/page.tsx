"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ApplicationCard } from "@/components/admissions/ApplicationCard";
import { ApplicationForm } from "@/components/admissions/ApplicationForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/lib/use-toast";
import { Plus } from "lucide-react";

const STATUSES = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];

interface Application {
  id: string; applicantName: string; grade: string; gender?: string | null;
  parentName: string; parentEmail: string; parentPhone: string;
  status: string; submittedAt: string; previousSchool?: string | null;
}

export default function AdmissionsPage() {
  const { toast } = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admissions");
      const data = await res.json();
      setApps(data.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admissions/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: `Application marked as ${status}.` });
      setSelected(null);
      load();
    } catch {
      toast({ title: "Failed to update status.", variant: "destructive" });
    }
  };

  const grouped = STATUSES.reduce<Record<string, Application[]>>((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s);
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    PENDING: "#F59E0B", REVIEWING: "#3B82F6", ACCEPTED: "#8DB531", REJECTED: "#C0392B",
  };

  return (
    <div>
      <PageHeader
        title="Admissions"
        description={`${apps.length} application${apps.length !== 1 ? "s" : ""}`}
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-1" />New Application</Button>}
      />

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {STATUSES.map((s) => <div key={s} className="h-64 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUSES.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                <span className="text-sm font-semibold text-gray-700">{status}</span>
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{grouped[status].length}</span>
              </div>
              <div className="space-y-3">
                {grouped[status].map((app) => (
                  <ApplicationCard key={app.id} application={app} onClick={() => setSelected(app)} />
                ))}
                {grouped[status].length === 0 && (
                  <div className="p-6 border-2 border-dashed rounded-xl text-center text-xs text-gray-400">No {status.toLowerCase()} applications</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Application Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Admission Application</DialogTitle></DialogHeader>
          <ApplicationForm onSuccess={() => { setOpen(false); load(); }} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Application Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{selected.applicantName}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[["Grade", selected.grade], ["Gender", selected.gender ?? "—"], ["Parent", selected.parentName], ["Email", selected.parentEmail], ["Phone", selected.parentPhone], ["Previous School", selected.previousSchool ?? "—"]].map(([k, v]) => (
                  <div key={k}><p className="text-xs text-gray-400">{k}</p><p className="font-medium">{v}</p></div>
                ))}
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-400 mb-2">Change Status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.filter((s) => s !== selected.status).map((s) => (
                    <Button key={s} size="sm" variant="outline" onClick={() => changeStatus(selected.id, s)}
                      style={{ borderColor: statusColors[s], color: statusColors[s] }}>
                      → {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
