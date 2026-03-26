"use client";

import { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  onExport?: () => void;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends object>({
  columns,
  data,
  searchKey,
  onExport,
  pageSize = 20,
  loading = false,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = searchKey
    ? data.filter((row) =>
        String(row[searchKey] ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getValue = (row: T, key: string) => {
    const parts = key.split(".");
    let val: unknown = row;
    for (const p of parts) val = (val as Record<string, unknown>)?.[p];
    return val;
  };

  // Page numbers to display (up to 5 around current)
  const pageNumbers: number[] = [];
  const delta = 2;
  const start = Math.max(1, page - delta);
  const end = Math.min(totalPages, page + delta);
  for (let n = start; n <= end; n++) pageNumbers.push(n);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#9DA3B4" }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border outline-none transition-all"
              style={{ backgroundColor: "#F5F6F8", borderColor: "#E2E4EA", color: "#4A5168" }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1A2340";
                e.target.style.backgroundColor = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E2E4EA";
                e.target.style.backgroundColor = "#F5F6F8";
              }}
            />
          </div>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full border transition-all hover:bg-gray-50 ml-auto"
            style={{ borderColor: "#E2E4EA", color: "#4A5168" }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border bg-white shadow-sm overflow-hidden"
        style={{ borderColor: "#E2E4EA" }}
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow
                className="hover:bg-[#E8EAF0]"
                style={{ backgroundColor: "#E8EAF0" }}
              >
                {columns.map((col) => (
                  <TableHead
                    key={String(col.key)}
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-wider py-3 sticky top-0",
                      col.className
                    )}
                    style={{ color: "#4A5168", backgroundColor: "#E8EAF0" }}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} className="py-3">
                        <div
                          className="h-4 rounded-full animate-pulse"
                          style={{ backgroundColor: "#F0F1F4" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-16 text-sm"
                    style={{ color: "#9DA3B4" }}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row, i) => (
                  <TableRow
                    key={i}
                    className="transition-colors cursor-default hover:bg-[#EEF7D6]"
                    style={{ backgroundColor: i % 2 === 0 ? "white" : "#FAFBFC" }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={cn("py-3 text-sm", col.className)}
                        style={{ color: "#4A5168" }}
                      >
                        {col.render
                          ? col.render(row)
                          : String(getValue(row, String(col.key)) ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "#9DA3B4" }}>
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              style={{ color: "#4A5168" }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="w-8 h-8 rounded-full text-sm font-semibold transition-all"
                style={
                  n === page
                    ? { backgroundColor: "#1A2340", color: "white" }
                    : { color: "#4A5168" }
                }
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              style={{ color: "#4A5168" }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
