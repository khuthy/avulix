import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate, daysOverdue } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default async function DebtorsPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const debts = await prisma.feeDebt.findMany({
    where: { schoolId, status: { in: ["OUTSTANDING", "PARTIAL"] } },
    include: {
      student: { include: { user: { select: { name: true } } } },
      feeStructure: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  const totalOutstanding = debts.reduce((sum, d) => sum + (Number(d.amount) - Number(d.paid)), 0);

  return (
    <div>
      <PageHeader title="Debtors" description="Outstanding fee balances" />

      {/* Total banner */}
      <div className="mb-6 p-5 rounded-xl flex items-center gap-4" style={{ backgroundColor: "#FDECEA" }}>
        <AlertCircle className="w-8 h-8 flex-shrink-0" style={{ color: "#C0392B" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "#8C2820" }}>Total Outstanding Amount</p>
          <p className="text-3xl font-bold" style={{ color: "#C0392B" }}>{formatCurrency(totalOutstanding)}</p>
        </div>
        <p className="ml-auto text-sm" style={{ color: "#8C2820" }}>{debts.length} outstanding account{debts.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              {["Student", "Grade", "Fee Type", "Amount Owed", "Paid", "Due Date", "Days Overdue", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {debts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No outstanding debts. Great news!</td></tr>
            ) : (
              debts.map((d) => {
                const outstanding = Number(d.amount) - Number(d.paid);
                const overdue = daysOverdue(d.dueDate);
                return (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.student.user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{d.student.grade}</td>
                    <td className="px-4 py-3">{d.feeStructure.name}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: "#C0392B" }}>{formatCurrency(outstanding)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatCurrency(d.paid)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(d.dueDate)}</td>
                    <td className="px-4 py-3">
                      {overdue > 0 ? (
                        <span className="font-semibold" style={{ color: "#C0392B" }}>{overdue} days</span>
                      ) : (
                        <span className="text-gray-400">Not due yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
