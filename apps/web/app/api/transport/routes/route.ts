import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { unstable_cache, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schoolId = session.user.schoolId;

  const routes = await unstable_cache(
    () => prisma.transportRoute.findMany({
      where: { schoolId },
      include: {
        assignments: {
          where: { endedAt: null },
          include: { student: { include: { user: { select: { name: true } } } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    [`transport-${schoolId}`],
    { tags: [`transport-${schoolId}`], revalidate: 120 }
  )();

  return NextResponse.json({ data: routes });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, driver, vehicle, plate, stops } = body;
  if (!name || !stops) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const route = await prisma.transportRoute.create({
    data: { schoolId: session!.user.schoolId, name, driver, vehicle, plate, stops },
  });

  revalidateTag(`transport-${session!.user.schoolId}`);

  return NextResponse.json({ data: route }, { status: 201 });
}
