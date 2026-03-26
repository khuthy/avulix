"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportCSVProps<T extends Record<string, unknown>> {
  data: T[];
  filename?: string;
  label?: string;
}

export function exportToCSV<T extends Record<string, unknown>>(data: T[], filename = "export"): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      const str = val == null ? "" : String(val);
      return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportCSV<T extends Record<string, unknown>>({ data, filename = "export", label = "Export CSV" }: ExportCSVProps<T>) {
  return (
    <Button variant="outline" size="sm" onClick={() => exportToCSV(data, filename)} className="gap-2">
      <Download className="w-4 h-4" />
      {label}
    </Button>
  );
}
