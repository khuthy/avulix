"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/use-toast";
import { Building2 } from "lucide-react";

const PROVINCES = ["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"];

interface School {
  id: string; name: string; emis?: string; address?: string; phone?: string;
  email?: string; website?: string; province?: string;
}

export default function SchoolSettingsPage() {
  const { toast } = useToast();
  const [school, setSchool] = useState<School | null>(null);
  const [form, setForm] = useState({ name: "", emis: "", address: "", phone: "", email: "", website: "", province: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/school").then((r) => r.json()).then((d) => {
      if (d.data) {
        setSchool(d.data);
        setForm({ name: d.data.name ?? "", emis: d.data.emis ?? "", address: d.data.address ?? "", phone: d.data.phone ?? "", email: d.data.email ?? "", website: d.data.website ?? "", province: d.data.province ?? "" });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings/school", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "School settings saved." });
    } catch {
      toast({ title: "Failed to save settings.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <PageHeader title="School Settings" description="Manage your school profile" />
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#E8EAF0" }}>
              <Building2 className="w-6 h-6" style={{ color: "#1A2340" }} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{school?.name ?? "Your School"}</h2>
              {school?.emis && <p className="text-sm text-gray-400">EMIS: {school.emis}</p>}
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2"><Label>School Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
              <div className="space-y-2"><Label>EMIS Number</Label><Input value={form.emis} onChange={(e) => set("emis", e.target.value)} placeholder="e.g. GP123456789" /></div>
              <div className="space-y-2"><Label>Province</Label>
                <select value={form.province} onChange={(e) => set("province", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." /></div>
              <div className="col-span-2 space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
