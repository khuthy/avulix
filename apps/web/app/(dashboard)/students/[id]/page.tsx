import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudentProfileCard } from "@/components/students/StudentProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props { params: { id: string } }

export default async function StudentProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const student = await prisma.student.findFirst({
    where: { id: params.id, schoolId },
    include: {
      user: { select: { name: true, email: true } },
      feePayments: { include: { feeStructure: { select: { name: true } }, recordedBy: { select: { name: true } } }, orderBy: { paidAt: "desc" } },
      feeDebts: { include: { feeStructure: { select: { name: true } } }, orderBy: { dueDate: "asc" } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  if (!student) notFound();

  const totalPaid = student.feePayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOutstanding = student.feeDebts
    .filter((d) => d.status !== "SETTLED")
    .reduce((sum, d) => sum + (Number(d.amount) - Number(d.paid)), 0);

  const attendanceDays = student.attendance;
  const presentDays = attendanceDays.filter((a) => a.status === "PRESENT").length;
  const attendanceRate = attendanceDays.length > 0 ? Math.round((presentDays / attendanceDays.length) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={student.user.name}
        description={`${student.grade} · ${student.admissionNumber}`}
        actions={<StatusBadge status={student.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudentProfileCard student={student as Parameters<typeof StudentProfileCard>[0]["student"]} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { label: "Attendance Rate", value: `${attendanceRate}%`, color: attendanceRate >= 80 ? "#8DB531" : "#C0392B" },
                  { label: "Total Paid", value: formatCurrency(totalPaid), color: "#8DB531" },
                  { label: "Outstanding", value: formatCurrency(totalOutstanding), color: totalOutstanding > 0 ? "#C0392B" : "#8DB531" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-xl border p-4 shadow-sm">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-xl font-bold mt-1" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-sm text-gray-500">{student.notes ?? "No notes recorded."}</p>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Last 30 Days Attendance</h3>
                <div className="grid grid-cols-7 gap-1.5">
                  {attendanceDays.map((a) => {
                    const colors: Record<string, string> = {
                      PRESENT: "#8DB531", ABSENT: "#C0392B", LATE: "#F59E0B", EXCUSED: "#3B82F6",
                    };
                    return (
                      <div key={a.id} title={`${formatDate(a.date)}: ${a.status}`}
                        className="w-full aspect-square rounded flex items-center justify-center text-[9px] font-bold text-white cursor-default"
                        style={{ backgroundColor: colors[a.status] ?? "#E2E4EA" }}
                      >
                        {a.status[0]}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  {[["#8DB531","Present"],["#C0392B","Absent"],["#F59E0B","Late"],["#3B82F6","Excused"]].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="finance">
              <div className="space-y-4">
                <div className="bg-white rounded-xl border p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
                  {student.feePayments.length === 0 ? (
                    <p className="text-sm text-gray-400">No payments recorded.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead><tr className="text-xs text-gray-400 border-b">
                        <th className="text-left pb-2">Receipt</th><th className="text-left pb-2">Fee</th>
                        <th className="text-left pb-2">Amount</th><th className="text-left pb-2">Method</th><th className="text-left pb-2">Date</th>
                      </tr></thead>
                      <tbody>
                        {student.feePayments.map((p) => (
                          <tr key={p.id} className="border-b last:border-0">
                            <td className="py-2 font-mono text-xs">{p.receiptNumber}</td>
                            <td className="py-2">{p.feeStructure.name}</td>
                            <td className="py-2 font-semibold">{formatCurrency(p.amount)}</td>
                            <td className="py-2">{p.method}</td>
                            <td className="py-2 text-gray-500">{formatDate(p.paidAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {student.feeDebts.length > 0 && (
                  <div className="bg-white rounded-xl border p-5 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-3">Outstanding Debts</h3>
                    {student.feeDebts.map((d) => (
                      <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{d.feeStructure.name}</p>
                          <p className="text-xs text-gray-400">Due {formatDate(d.dueDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: "#C0392B" }}>{formatCurrency(Number(d.amount) - Number(d.paid))}</p>
                          <StatusBadge status={d.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
