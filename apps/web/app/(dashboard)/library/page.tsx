import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const schoolId = session!.user.schoolId;

  const [resources, loans] = await Promise.all([
    prisma.libraryResource.findMany({ where: { schoolId }, orderBy: { title: "asc" } }),
    prisma.libraryLoan.findMany({
      where: { resource: { schoolId }, returnedAt: null },
      include: {
        resource: { select: { title: true, schoolId: true } },
        user: { select: { name: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const overdue = loans.filter((l) => new Date(l.dueDate) < new Date());

  return (
    <div>
      <PageHeader title="Library" description={`${resources.length} resource${resources.length !== 1 ? "s" : ""}`} />

      <Tabs defaultValue="resources">
        <TabsList className="mb-4">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="loans">Active Loans ({loans.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdue.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Type</TableHead>
                  <TableHead>Available</TableHead><TableHead>Total</TableHead><TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="text-gray-500">{r.author ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.type} /></TableCell>
                    <TableCell>
                      <span className={r.available === 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>{r.available}</span>
                    </TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell className="text-gray-500">{r.location ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {resources.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-400">No library resources yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="loans">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Resource</TableHead><TableHead>Borrower</TableHead><TableHead>Borrowed</TableHead><TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.resource.title}</TableCell>
                    <TableCell>{l.user.name}</TableCell>
                    <TableCell className="text-gray-500">{formatDate(l.borrowedAt)}</TableCell>
                    <TableCell className={new Date(l.dueDate) < new Date() ? "text-red-600 font-semibold" : ""}>{formatDate(l.dueDate)}</TableCell>
                  </TableRow>
                ))}
                {loans.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">No active loans.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="overdue">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Resource</TableHead><TableHead>Borrower</TableHead><TableHead>Due Date</TableHead><TableHead>Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdue.map((l) => {
                  const days = Math.floor((Date.now() - new Date(l.dueDate).getTime()) / 86400000);
                  return (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.resource.title}</TableCell>
                      <TableCell>{l.user.name}</TableCell>
                      <TableCell className="text-red-600">{formatDate(l.dueDate)}</TableCell>
                      <TableCell><span className="font-bold text-red-600">{days} days</span></TableCell>
                    </TableRow>
                  );
                })}
                {overdue.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">No overdue loans.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
