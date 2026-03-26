import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const debts = await unstable_cache(
    () => prisma.feeDebt.findMany({
      where: { schoolId, status: { in: ["OUTSTANDING", "PARTIAL"] } },
      include: {
        student: { include: { user: { select: { name: true } } } },
        feeStructure: { select: { name: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    [`debtors-${schoolId}`],
    { tags: [`debtors-${schoolId}`], revalidate: 60 }
  )();

  return NextResponse.json({ data: debts });
}
