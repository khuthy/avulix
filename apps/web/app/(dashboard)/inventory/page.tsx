import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const items = await prisma.inventoryItem.findMany({
    where: { schoolId },
    orderBy: { category: "asc" },
  });

  return (
    <div>
      <PageHeader title="Inventory" description={`${items.length} item${items.length !== 1 ? "s" : ""} tracked`} />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Qty</TableHead>
              <TableHead>Condition</TableHead><TableHead>Location</TableHead>
              <TableHead>Purchase Date</TableHead><TableHead>Value</TableHead><TableHead>Last Audit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.serialNumber && <p className="text-xs text-gray-400">S/N: {item.serialNumber}</p>}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{item.category}</TableCell>
                <TableCell className="font-semibold">{item.quantity}</TableCell>
                <TableCell><StatusBadge status={item.condition} /></TableCell>
                <TableCell className="text-gray-500">{item.location ?? "—"}</TableCell>
                <TableCell className="text-gray-500">{item.purchaseDate ? formatDate(item.purchaseDate) : "—"}</TableCell>
                <TableCell className="text-gray-500">
                  {item.purchasePrice ? formatCurrency(Number(item.purchasePrice) * item.quantity) : "—"}
                </TableCell>
                <TableCell className="text-gray-500">{item.lastAuditDate ? formatDate(item.lastAuditDate) : "Never"}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">No inventory items yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
