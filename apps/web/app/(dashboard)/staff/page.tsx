import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const staff = await prisma.staff.findMany({
    where: { schoolId },
    include: { user: { select: { name: true, email: true, lastLoginAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Staff"
        description={`${staff.length} staff member${staff.length !== 1 ? "s" : ""}`}
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Staff No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Hired</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-gray-300" />
                    No staff records found.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.staffNumber}</TableCell>
                  <TableCell className="font-medium">{s.user.name}</TableCell>
                  <TableCell className="text-gray-500">{s.user.email}</TableCell>
                  <TableCell>{s.department ?? "—"}</TableCell>
                  <TableCell>{s.position}</TableCell>
                  <TableCell>{formatDate(s.hireDate)}</TableCell>
                  <TableCell className="text-gray-500">{s.user.lastLoginAt ? formatDate(s.user.lastLoginAt) : "Never"}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
