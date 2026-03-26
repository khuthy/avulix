import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";
import { generateReceiptNumber } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const payments = await unstable_cache(
    () => prisma.feePayment.findMany({
      where: { schoolId },
      include: {
        student: { include: { user: { select: { name: true } } } },
        feeStructure: { select: { name: true } },
        recordedBy: { select: { name: true } },
      },
      orderBy: { paidAt: "desc" },
    }),
    [`payments-${schoolId}`],
    { tags: [`payments-${schoolId}`], revalidate: 30 }
  )();

  return NextResponse.json({ data: payments });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const body = await req.json();
  const { studentId, feeStructureId, amount, method, reference, note } = body;

  if (!studentId || !feeStructureId || !amount || !method) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const count = await prisma.feePayment.count({ where: { schoolId } });
  const receiptNumber = generateReceiptNumber(count + 1);

  const payment = await prisma.feePayment.create({
    data: { schoolId, studentId, feeStructureId, amount, method, receiptNumber, reference, note, recordedById: session.user.id },
  });

  await prisma.feeDebt.updateMany({
    where: { schoolId, studentId, feeStructureId, status: { in: ["OUTSTANDING", "PARTIAL"] } },
    data: { paid: { increment: amount }, status: "PARTIAL" },
  });

  await logAction({ schoolId, userId: session.user.id, action: "CREATE", entity: "FeePayment", entityId: payment.id, newValues: { amount, method, receiptNumber } });

  revalidateTag(`payments-${schoolId}`);
  revalidateTag(`debtors-${schoolId}`);
  revalidateTag(`dashboard-${schoolId}`);

  return NextResponse.json({ data: payment }, { status: 201 });
}
