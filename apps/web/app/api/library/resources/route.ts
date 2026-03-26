import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const resources = await unstable_cache(
    () => prisma.libraryResource.findMany({
      where: { schoolId },
      orderBy: { title: "asc" },
    }),
    [`library-${schoolId}`],
    { tags: [`library-${schoolId}`], revalidate: 120 }
  )();

  return NextResponse.json({ data: resources });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, author, type, isbn, publisher, year, quantity, location, isDigital, digitalUrl } = body;

  if (!title || !type) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const resource = await prisma.libraryResource.create({
    data: { schoolId: session.user.schoolId, title, author, type, isbn, publisher, year, quantity: quantity ?? 1, available: quantity ?? 1, location, isDigital: isDigital ?? false, digitalUrl },
  });

  revalidateTag(`library-${session.user.schoolId}`);

  return NextResponse.json({ data: resource }, { status: 201 });
}
