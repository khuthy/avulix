import { unstable_cache } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  GraduationCap, Users, Wallet, AlertCircle,
  UserCheck, ClipboardList,
} from "lucide-react";
import Link from "next/link";

const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const getDashboardStats = (schoolId: string) =>
  unstable_cache(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      const [
        totalStudents, totalStaff, monthPayments, debts,
        todayAttendance, totalAttendance, applications, recentAudit,
        chartPayments,
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
          take: 8,
          include: { user: { select: { name: true } } },
        }),
        prisma.feePayment.findMany({
          where: { schoolId, paidAt: { gte: sixMonthsAgo } },
          select: { amount: true, paidAt: true },
        }),
      ]);

      const attendanceRate =
        totalAttendance > 0 ? Math.round((todayAttendance / totalAttendance) * 100) : 0;

      // Build 6-month chart data
      const monthMap: Record<string, number> = {};
      for (const p of chartPayments) {
        const key = `${p.paidAt.getFullYear()}-${p.paidAt.getMonth()}`;
        monthMap[key] = (monthMap[key] ?? 0) + Number(p.amount);
      }
      const chartData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        return { month: MONTH_SHORT[d.getMonth()], amount: monthMap[key] ?? 0 };
      });

      return {
        totalStudents, totalStaff, monthPayments, debts,
        attendanceRate, applications, recentAudit, chartData,
      };
    },
    [`dashboard-${schoolId}`],
    { tags: [`dashboard-${schoolId}`], revalidate: 60 }
  )();

function FinanceBarChart({ data }: { data: { month: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  return (
    <div className="flex items-end gap-2 h-28 pt-2">
      {data.map(({ month, amount }) => {
        const pct = Math.max(6, (amount / max) * 100);
        return (
          <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
            {amount > 0 && (
              <span className="text-[9px] font-semibold" style={{ color: "#8DB531" }}>
                R{amount >= 1000 ? `${Math.round(amount / 1000)}k` : Math.round(amount)}
              </span>
            )}
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${pct}%`,
                backgroundColor: amount === 0 ? "#E2E4EA" : "#8DB531",
              }}
            />
            <span className="text-[10px]" style={{ color: "#9DA3B4" }}>{month}</span>
          </div>
        );
      })}
    </div>
  );
}

const quickActions = [
  { href: "/students?action=new", emoji: "🎓", label: "Add Learner", bg: "#EEF7D6", accent: "#637F22" },
  { href: "/finance/payments?action=new", emoji: "💳", label: "Record Payment", bg: "#E8EAF0", accent: "#1A2340" },
  { href: "/admissions?action=new", emoji: "📋", label: "New Application", bg: "#FDECEA", accent: "#8C2820" },
  { href: "/attendance", emoji: "✅", label: "Mark Attendance", bg: "#EEF7D6", accent: "#637F22" },
];

const activityDotColors: Record<string, string> = {
  CREATE: "#8DB531",
  UPDATE: "#F59E0B",
  DELETE: "#C0392B",
  LOGIN: "#3B82F6",
};

export default async function DashboardPage() {
  const session = await getSession();
  const schoolId = session!.user.schoolId;
  const hour = new Date().getHours();
  const firstName = (session!.user.name ?? "there").split(" ")[0];

  const [stats, school] = await Promise.all([
    getDashboardStats(schoolId),
    unstable_cache(
      () => prisma.school.findUnique({ where: { id: schoolId } }),
      [`school-${schoolId}`],
      { tags: [`school-${schoolId}`], revalidate: 300 }
    )(),
  ]);

  const todayStr = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#1F2533" }}>
          {getGreeting(hour)}, {firstName} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "#9DA3B4" }}>
          {school?.name ?? "Your School"} &middot; {todayStr}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Active Students" value={stats.totalStudents} icon={GraduationCap} color="navy" />
        <StatCard title="Active Staff" value={stats.totalStaff} icon={Users} color="navy" />
        <StatCard
          title="This Month Revenue"
          value={formatCurrency(Number(stats.monthPayments._sum.amount ?? 0))}
          icon={Wallet}
          color="lime"
        />
        <StatCard
          title="Outstanding Debts"
          value={formatCurrency(Number(stats.debts._sum.amount ?? 0))}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Attendance Today"
          value={`${stats.attendanceRate}%`}
          icon={UserCheck}
          color={stats.attendanceRate >= 80 ? "lime" : "red"}
        />
        <StatCard
          title="Pending Applications"
          value={stats.applications}
          icon={ClipboardList}
          color="gray"
        />
      </div>

      {/* Lower row: quick actions | chart | activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #E2E4EA" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#9DA3B4" }}
          >
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ href, emoji, label, bg, accent }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: bg }}
              >
                <span className="text-2xl leading-none">{emoji}</span>
                <span className="text-xs font-bold leading-tight" style={{ color: accent }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Finance mini chart */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #E2E4EA" }}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "#9DA3B4" }}
            >
              Fee Collection
            </p>
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#EEF7D6", color: "#637F22" }}
            >
              Last 6 months
            </span>
          </div>
          <FinanceBarChart data={stats.chartData} />
        </div>

        {/* Recent activity */}
        <div
          className="bg-white rounded-2xl p-5 shadow-sm"
          style={{ border: "1px solid #E2E4EA" }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#9DA3B4" }}
          >
            Recent Activity
          </p>
          {stats.recentAudit.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "#9DA3B4" }}>
              No activity yet.
            </p>
          ) : (
            <div>
              {stats.recentAudit.map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-2.5"
                  style={{
                    borderBottom:
                      i < stats.recentAudit.length - 1
                        ? "1px solid #F0F1F4"
                        : "none",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: activityDotColors[log.action] ?? "#9DA3B4" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: "#1F2533" }}>
                      <span className="font-semibold">{log.user.name}</span>{" "}
                      <span style={{ color: "#9DA3B4" }}>{log.action.toLowerCase()}d</span>{" "}
                      <span className="font-medium">{log.entity}</span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9DA3B4" }}>
                      {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={log.action} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
