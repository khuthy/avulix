import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const student = await prisma.student.findFirst({
    where: { id: params.id, schoolId: session.user.schoolId },
    include: {
      user: { select: { name: true, email: true } },
      feePayments: { include: { feeStructure: true, recordedBy: { select: { name: true } } }, orderBy: { paidAt: "desc" } },
      feeDebts: { include: { feeStructure: true }, orderBy: { dueDate: "asc" } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: student });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const student = await prisma.student.findFirst({ where: { id: params.id, schoolId: session.user.schoolId } });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.student.update({
    where: { id: params.id },
    data: { grade: body.grade, gender: body.gender, guardianName: body.guardianName, guardianPhone: body.guardianPhone, guardianEmail: body.guardianEmail, address: body.address, notes: body.notes, status: body.status },
  });

  await logAction({ schoolId: session.user.schoolId, userId: session.user.id, action: "UPDATE", entity: "Student", entityId: params.id });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.student.update({ where: { id: params.id }, data: { status: "INACTIVE" } });
  await logAction({ schoolId: session!.user.schoolId, userId: session!.user.id, action: "DELETE", entity: "Student", entityId: params.id });
  return NextResponse.json({ message: "Student deactivated" });
}
