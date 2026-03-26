import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const grade = searchParams.get("grade");

  const date = dateParam ? new Date(dateParam) : new Date();
  date.setHours(0, 0, 0, 0);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const dateStr = date.toISOString().split("T")[0];

  const cacheKey = `attendance-${schoolId}-${dateStr}-${grade ?? "all"}`;
  const records = await unstable_cache(
    async () => {
      const where: Record<string, unknown> = { schoolId, date: { gte: date, lt: nextDay } };
      if (grade) {
        const students = await prisma.student.findMany({ where: { schoolId, grade }, select: { id: true } });
        where["studentId"] = { in: students.map((s) => s.id) };
      }
      return prisma.attendance.findMany({ where, include: { student: { include: { user: { select: { name: true } } } } } });
    },
    [cacheKey],
    { tags: [`attendance-${schoolId}`], revalidate: 30 }
  )();

  return NextResponse.json({ data: records });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const { records } = await req.json() as { records: { studentId: string; status: string; date: string; note?: string }[] };
  if (!records?.length) return NextResponse.json({ error: "No records" }, { status: 400 });

  const results = await Promise.all(
    records.map(({ studentId, status, date, note }) =>
      prisma.attendance.upsert({
        where: { studentId_date: { studentId, date: new Date(date) } },
        update: { status: status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED", note, recordedById: session.user.id },
        create: { schoolId, studentId, status: status as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED", date: new Date(date), note, recordedById: session.user.id },
      })
    )
  );

  revalidateTag(`attendance-${schoolId}`);
  revalidateTag(`dashboard-${schoolId}`);

  return NextResponse.json({ data: results, count: results.length });
}
