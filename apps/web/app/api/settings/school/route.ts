import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const school = await prisma.school.findUnique({ where: { id: session.user.schoolId } });
  return NextResponse.json({ data: school });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, emis, address, phone, email, website, province } = body;

  const school = await prisma.school.update({
    where: { id: session!.user.schoolId },
    data: { name, emis, address, phone, email, website, province },
  });

  await logAction({ schoolId: session!.user.schoolId, userId: session!.user.id, action: "UPDATE", entity: "School", entityId: school.id });
  return NextResponse.json({ data: school });
}
