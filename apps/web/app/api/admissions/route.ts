import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const apps = await unstable_cache(
    () => prisma.admissionApplication.findMany({
      where: { schoolId },
      orderBy: { submittedAt: "desc" },
    }),
    [`admissions-${schoolId}`],
    { tags: [`admissions-${schoolId}`], revalidate: 60 }
  )();

  return NextResponse.json({ data: apps });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { applicantName, grade, gender, dateOfBirth, parentName, parentEmail, parentPhone, address, previousSchool, notes } = body;

  if (!applicantName || !grade || !parentName || !parentEmail || !parentPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const app = await prisma.admissionApplication.create({
    data: {
      schoolId: session.user.schoolId, applicantName, grade, gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      parentName, parentEmail, parentPhone, address, previousSchool, notes,
    },
  });

  await logAction({ schoolId: session.user.schoolId, userId: session.user.id, action: "CREATE", entity: "AdmissionApplication", entityId: app.id });

  revalidateTag(`admissions-${session.user.schoolId}`);
  revalidateTag(`dashboard-${session.user.schoolId}`);

  return NextResponse.json({ data: app }, { status: 201 });
}
