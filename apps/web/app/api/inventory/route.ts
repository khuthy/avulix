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

  const items = await unstable_cache(
    () => prisma.inventoryItem.findMany({
      where: { schoolId },
      orderBy: { category: "asc" },
    }),
    [`inventory-${schoolId}`],
    { tags: [`inventory-${schoolId}`], revalidate: 120 }
  )();

  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, category, quantity, condition, location, supplier, purchaseDate, purchasePrice, serialNumber, notes } = body;

  if (!name || !category) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const item = await prisma.inventoryItem.create({
    data: {
      schoolId: session.user.schoolId, name, category, quantity: quantity ?? 1,
      condition: condition ?? "GOOD", location, supplier, serialNumber, notes,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      purchasePrice: purchasePrice ?? undefined,
    },
  });

  await logAction({ schoolId: session.user.schoolId, userId: session.user.id, action: "CREATE", entity: "InventoryItem", entityId: item.id });

  revalidateTag(`inventory-${session.user.schoolId}`);

  return NextResponse.json({ data: item }, { status: 201 });
}
