import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalStudents, totalStaff, monthRevenue, outstandingDebt, todayPresent, todayTotal, newApplications] = await Promise.all([
    prisma.student.count({ where: { schoolId, status: "ACTIVE" } }),
    prisma.staff.count({ where: { schoolId, status: "ACTIVE" } }),
    prisma.feePayment.aggregate({ where: { schoolId, paidAt: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.feeDebt.aggregate({ where: { schoolId, status: { in: ["OUTSTANDING", "PARTIAL"] } }, _sum: { amount: true } }),
    prisma.attendance.count({ where: { schoolId, status: "PRESENT", date: { gte: today } } }),
    prisma.attendance.count({ where: { schoolId, date: { gte: today } } }),
    prisma.admissionApplication.count({ where: { schoolId, status: "PENDING" } }),
  ]);

  const attendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

  return NextResponse.json({
    data: {
      totalStudents,
      totalStaff,
      monthRevenue: monthRevenue._sum.amount ?? 0,
      outstandingDebt: outstandingDebt._sum.amount ?? 0,
      attendanceRate,
      newApplications,
    },
  });
}
