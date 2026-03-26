import { unstable_cache } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  GraduationCap, Users, Wallet, AlertCircle,
  UserCheck, ClipboardList, Plus, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const getDashboardStats = (schoolId: string) =>
  unstable_cache(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        totalStudents, totalStaff, monthPayments, debts,
        todayAttendance, totalAttendance, applications, recentAudit,
      ] = await Promise.all([
        prisma.student.count({ where: { schoolId, status: "ACTIVE" } }),
        prisma.staff.count({ where: { schoolId, status: "ACTIVE" } }),
        prisma.feePayment.aggregate({
          where: { schoolId, paidAt: { gte: monthStart } },
          _sum: { amount: true },
        }),
        prisma.feeDebt.aggregate({
          where: { schoolId, status: { in: ["OUTSTANDING", "PARTIAL"] } },
          _sum: { amount: true },
        }),
        prisma.attendance.count({ where: { schoolId, status: "PRESENT", date: { gte: today } } }),
        prisma.attendance.count({ where: { schoolId, date: { gte: today } } }),
        prisma.admissionApplication.count({ where: { schoolId, status: "PENDING" } }),
        prisma.auditLog.findMany({
          where: { schoolId },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { user: { select: { name: true } } },
        }),
      ]);

      const attendanceRate = totalAttendance > 0 ? Math.round((todayAttendance / totalAttendance) * 100) : 0;
      return { totalStudents, totalStaff, monthPayments, debts, attendanceRate, applications, recentAudit };
    },
    [`dashboard-${schoolId}`],
    { tags: [`dashboard-${schoolId}`], revalidate: 60 }
  )();

export default async function DashboardPage() {
  const session = await getSession();
  const schoolId = session!.user.schoolId;

  const [stats, school] = await Promise.all([
    getDashboardStats(schoolId),
    unstable_cache(
      () => prisma.school.findUnique({ where: { id: schoolId } }),
      [`school-${schoolId}`],
      { tags: [`school-${schoolId}`], revalidate: 300 }
    )(),
  ]);

  return (
    <div>
      <PageHeader
        title={`Welcome back!`}
        description={school?.name ?? "School Dashboard"}
        actions={
          <div className="flex gap-2">
            <Link href="/students?action=new"><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Student</Button></Link>
            <Link href="/finance/payments?action=new"><Button size="sm" variant="outline"><CreditCard className="w-4 h-4 mr-1" />Record Payment</Button></Link>
          </div>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} color="navy" className="xl:col-span-1" />
        <StatCard title="Total Staff" value={stats.totalStaff} icon={Users} color="navy" className="xl:col-span-1" />
        <StatCard
          title="This Month Revenue"
          value={formatCurrency(Number(stats.monthPayments._sum.amount ?? 0))}
          icon={Wallet}
          color="lime"
          className="xl:col-span-1"
        />
        <StatCard
          title="Outstanding Debts"
          value={formatCurrency(Number(stats.debts._sum.amount ?? 0))}
          icon={AlertCircle}
          color="red"
          className="xl:col-span-1"
        />
        <StatCard
          title="Attendance Rate Today"
          value={`${stats.attendanceRate}%`}
          icon={UserCheck}
          color={stats.attendanceRate >= 80 ? "lime" : "red"}
          className="xl:col-span-1"
        />
        <StatCard title="New Applications" value={stats.applications} icon={ClipboardList} color="gray" className="xl:col-span-1" />
      </div>

      {/* Quick actions + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/students?action=new", icon: GraduationCap, label: "Add Student" },
              { href: "/finance/payments?action=new", icon: CreditCard, label: "Record Payment" },
              { href: "/admissions?action=new", icon: ClipboardList, label: "New Application" },
              { href: "/attendance", icon: UserCheck, label: "Mark Attendance" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border hover:border-[#C0392B] hover:bg-[#FDECEA] transition-colors text-center group"
              >
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-[#C0392B]" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-[#C0392B]">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentAudit.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No activity yet.</p>
            ) : (
              stats.recentAudit.map((log) => {
                const actionColors: Record<string, string> = {
                  CREATE: "#8DB531", UPDATE: "#F59E0B", DELETE: "#C0392B", LOGIN: "#3B82F6",
                };
                return (
                  <div key={log.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: actionColors[log.action] ?? "#9DA3B4" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{log.user.name}</span>{" "}
                        <span className="text-gray-500">{log.action.toLowerCase()}d</span>{" "}
                        <span className="text-gray-700">{log.entity}</span>
                      </p>
                      <p className="text-xs text-gray-400">{formatDateTime(log.createdAt)}</p>
                    </div>
                    <StatusBadge status={log.action} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
