import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const actionColors: Record<string, "lime" | "amber" | "red" | "blue" | "gray"> = {
  CREATE: "lime", UPDATE: "amber", DELETE: "red", LOGIN: "blue", EXPORT: "gray",
};

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  if (!["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(session?.user?.role ?? "")) redirect("/dashboard");
  const schoolId = session!.user.schoolId;

  const logs = await prisma.auditLog.findMany({
    where: { schoolId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <PageHeader title="Audit Log" description="System activity trail — last 200 entries" />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              {["Timestamp", "User", "Action", "Entity", "Entity ID", "IP Address"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{log.user.name}</p>
                  <p className="text-xs text-gray-400">{log.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={actionColors[log.action] ?? "gray"}>{log.action}</Badge>
                </td>
                <td className="px-4 py-3 font-medium">{log.entity}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.entityId ? log.entityId.slice(0, 12) + "..." : "—"}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ipAddress ?? "—"}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No audit log entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
