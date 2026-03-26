import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");
  const status = searchParams.get("status");

  const cacheKey = `students-${schoolId}-${grade ?? "all"}-${status ?? "all"}`;
  const students = await unstable_cache(
    () => prisma.student.findMany({
      where: { schoolId, ...(grade ? { grade } : {}), ...(status ? { status } : {}) },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    [cacheKey],
    { tags: [`students-${schoolId}`], revalidate: 60 }
  )();

  return NextResponse.json({ data: students });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const body = await req.json();
  const { name, email, grade, gender, dateOfBirth, guardianName, guardianPhone, guardianEmail, address, notes } = body;

  if (!name || !email || !grade || !guardianName || !guardianPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const year = new Date().getFullYear();
  const count = await prisma.student.count({ where: { schoolId } });
  const admissionNumber = `ADM-${year}-${String(count + 1).padStart(3, "0")}`;
  const hashedPassword = await bcrypt.hash("Student123!", 10);

  const user = await prisma.user.create({
    data: { schoolId, name, email: email.toLowerCase().trim(), hashedPassword, role: "STUDENT" },
  });

  const student = await prisma.student.create({
    data: {
      schoolId, userId: user.id, admissionNumber, grade,
      gender, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      guardianName, guardianPhone, guardianEmail, address, notes,
    },
  });

  await logAction({ schoolId, userId: session.user.id, action: "CREATE", entity: "Student", entityId: student.id, newValues: { name, grade } });

  revalidateTag(`students-${schoolId}`);
  revalidateTag(`dashboard-${schoolId}`);

  return NextResponse.json({ data: student }, { status: 201 });
}
