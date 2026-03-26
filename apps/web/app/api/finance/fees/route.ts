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

  const fees = await unstable_cache(
    () => prisma.feeStructure.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
    }),
    [`fees-${schoolId}`],
    { tags: [`fees-${schoolId}`], revalidate: 120 }
  )();

  return NextResponse.json({ data: fees });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, amount, frequency, gradeLevel } = body;

  if (!name || !amount || !frequency) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const fee = await prisma.feeStructure.create({
    data: { schoolId: session!.user.schoolId, name, description, amount, frequency, gradeLevel },
  });

  await logAction({ schoolId: session!.user.schoolId, userId: session!.user.id, action: "CREATE", entity: "FeeStructure", entityId: fee.id });

  revalidateTag(`fees-${session!.user.schoolId}`);

  return NextResponse.json({ data: fee }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, isActive } = await req.json();
  const fee = await prisma.feeStructure.update({ where: { id }, data: { isActive } });

  revalidateTag(`fees-${session!.user.schoolId}`);

  return NextResponse.json({ data: fee });
}
