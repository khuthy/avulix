import { formatCurrency, formatDate, daysOverdue } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AlertCircle } from "lucide-react";

interface Debtor {
  id: string;
  studentName: string;
  grade: string;
  feeName: string;
  amount: number;
  paid: number;
  dueDate: string | Date;
  status: string;
}

export function DebtorCard({ debtor }: { debtor: Debtor }) {
  const outstanding = Number(debtor.amount) - Number(debtor.paid);
  const overdue = daysOverdue(debtor.dueDate);

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{debtor.studentName}</p>
          <p className="text-sm text-gray-500">{debtor.grade} · {debtor.feeName}</p>
        </div>
        <StatusBadge status={debtor.status} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Outstanding</p>
          <p className="text-lg font-bold" style={{ color: "#C0392B" }}>{formatCurrency(outstanding)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Due {formatDate(debtor.dueDate)}</p>
          {overdue > 0 && (
            <div className="flex items-center gap-1 justify-end mt-1">
              <AlertCircle className="w-3 h-3" style={{ color: "#C0392B" }} />
              <span className="text-xs font-medium" style={{ color: "#C0392B" }}>{overdue} days overdue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
