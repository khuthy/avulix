import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const loans = await prisma.libraryLoan.findMany({
    where: { resource: { schoolId: session.user.schoolId } },
    include: { resource: { select: { title: true } }, user: { select: { name: true } } },
    orderBy: { borrowedAt: "desc" },
  });
  return NextResponse.json({ data: loans });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resourceId, userId, dueDate } = await req.json();
  if (!resourceId || !userId || !dueDate) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const resource = await prisma.libraryResource.findFirst({ where: { id: resourceId, schoolId: session.user.schoolId } });
  if (!resource || resource.available <= 0) return NextResponse.json({ error: "Resource unavailable" }, { status: 409 });

  const [loan] = await prisma.$transaction([
    prisma.libraryLoan.create({ data: { resourceId, userId, dueDate: new Date(dueDate) } }),
    prisma.libraryResource.update({ where: { id: resourceId }, data: { available: { decrement: 1 } } }),
  ]);

  return NextResponse.json({ data: loan }, { status: 201 });
}
