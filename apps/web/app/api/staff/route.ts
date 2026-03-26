import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const staff = await unstable_cache(
    () => prisma.staff.findMany({
      where: { schoolId },
      include: { user: { select: { name: true, email: true, lastLoginAt: true } } },
      orderBy: { createdAt: "desc" },
    }),
    [`staff-${schoolId}`],
    { tags: [`staff-${schoolId}`], revalidate: 60 }
  )();

  return NextResponse.json({ data: staff });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, department, position, hireDate, salary } = body;
  const schoolId = session!.user.schoolId;

  const count = await prisma.staff.count({ where: { schoolId } });
  const staffNumber = `STF-${String(count + 1).padStart(3, "0")}`;

  const staff = await prisma.staff.create({
    data: { schoolId, userId, staffNumber, department, position, hireDate: new Date(hireDate), salary },
  });

  revalidateTag(`staff-${schoolId}`);
  revalidateTag(`dashboard-${schoolId}`);

  return NextResponse.json({ data: staff }, { status: 201 });
}
