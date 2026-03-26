import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

interface Params { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  const validStatuses = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const app = await prisma.admissionApplication.findFirst({
    where: { id: params.id, schoolId: session.user.schoolId },
  });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.admissionApplication.update({
    where: { id: params.id },
    data: { status, reviewedAt: new Date() },
  });

  await logAction({ schoolId: session.user.schoolId, userId: session.user.id, action: "UPDATE", entity: "AdmissionApplication", entityId: params.id, newValues: { status } });

  return NextResponse.json({ data: updated });
}
