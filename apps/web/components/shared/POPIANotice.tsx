"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function POPIANotice() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Check if POPIA seen — we store in localStorage as a lightweight client check
      const key = `popia-seen-${session.user.id}`;
      if (!localStorage.getItem(key)) setVisible(true);
    }
  }, [session]);

  const dismiss = async () => {
    if (!session?.user) return;
    try {
      await fetch("/api/user/popia-seen", { method: "PATCH" });
      localStorage.setItem(`popia-seen-${session.user.id}`, "1");
    } catch {
      // Non-critical
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 no-print">
      <div className="max-w-4xl mx-auto m-4 p-4 bg-white border rounded-xl shadow-lg flex items-start gap-4" style={{ borderColor: "#1A2340" }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8EAF0" }}>
          <Shield className="w-4 h-4" style={{ color: "#1A2340" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-0.5">POPIA Compliance Notice</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Avulix processes personal information in accordance with the{" "}
            <strong>Protection of Personal Information Act (POPIA), Act 4 of 2013</strong>. Your school data is stored securely with access controls and audit trails.
          </p>
        </div>
        <Button size="sm" onClick={dismiss} className="flex-shrink-0">
          I understand
        </Button>
        <button onClick={dismiss} className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
