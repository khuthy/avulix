import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin", SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher", STUDENT: "Student", PARENT: "Parent",
};

export default async function UsersSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) redirect("/dashboard");
  const schoolId = session!.user.schoolId;

  const users = await prisma.user.findMany({
    where: { schoolId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Users" description={`${users.length} user accounts`} />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead>
              <TableHead>Status</TableHead><TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-gray-500">{u.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: "#E8EAF0", color: "#1A2340" }}>
                    {roleLabels[u.role] ?? u.role}
                  </span>
                </TableCell>
                <TableCell><StatusBadge status={u.isActive ? "ACTIVE" : "INACTIVE"} /></TableCell>
                <TableCell className="text-gray-500">{u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
