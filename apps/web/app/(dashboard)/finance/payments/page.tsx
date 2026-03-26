"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/finance/PaymentForm";
import { ReceiptPrint } from "@/components/finance/ReceiptPrint";
import { exportToCSV } from "@/components/shared/ExportCSV";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Plus } from "lucide-react";

interface Payment {
  id: string; receiptNumber: string; amount: number; method: string;
  reference?: string; paidAt: string; note?: string;
  student: { admissionNumber: string; user: { name: string } };
  feeStructure: { name: string };
  recordedBy: { name: string };
}
interface Student { id: string; name: string; admissionNumber: string; }
interface FeeStructure { id: string; name: string; amount: number; }

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [schoolName, setSchoolName] = useState("Avulix Demo School");

  const load = async () => {
    setLoading(true);
    const [pRes, sRes, fRes] = await Promise.all([
      fetch("/api/finance/payments"),
      fetch("/api/students?limit=200"),
      fetch("/api/finance/fees"),
    ]);
    const [pData, sData, fData] = await Promise.all([pRes.json(), sRes.json(), fRes.json()]);
    setPayments(pData.data ?? []);
    setStudents((sData.data ?? []).map((s: { id: string; admissionNumber: string; user: { name: string } }) => ({
      id: s.id, name: s.user?.name, admissionNumber: s.admissionNumber,
    })));
    setFees(fData.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const columns: Column<Payment>[] = [
    { key: "receiptNumber", label: "Receipt No", render: (r) => <span className="font-mono text-xs">{r.receiptNumber}</span> },
    { key: "student", label: "Student", render: (r) => r.student?.user?.name ?? "—" },
    { key: "feeStructure", label: "Fee Type", render: (r) => r.feeStructure?.name ?? "—" },
    { key: "amount", label: "Amount", render: (r) => <span className="font-semibold">{formatCurrency(r.amount)}</span> },
    { key: "method", label: "Method" },
    { key: "recordedBy", label: "Recorded By", render: (r) => r.recordedBy?.name ?? "—" },
    { key: "paidAt", label: "Date", render: (r) => formatDateTime(r.paidAt) },
    {
      key: "actions", label: "",
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => setReceiptPayment(r)}>Print</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Fee payment history"
        actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-1" />Record Payment</Button>}
      />

      <DataTable
        columns={columns}
        data={payments}
        searchKey="receiptNumber"
        loading={loading}
        onExport={() => exportToCSV(payments.map((p) => ({
          Receipt: p.receiptNumber, Student: p.student?.user?.name, Fee: p.feeStructure?.name,
          Amount: p.amount, Method: p.method, Date: p.paidAt,
        })), "payments")}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <PaymentForm students={students} feeStructures={fees} onSuccess={() => { setOpen(false); load(); }} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {receiptPayment && (
        <Dialog open={!!receiptPayment} onOpenChange={() => setReceiptPayment(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Receipt — {receiptPayment.receiptNumber}</DialogTitle></DialogHeader>
            <ReceiptPrint receipt={{
              receiptNumber: receiptPayment.receiptNumber,
              schoolName,
              studentName: receiptPayment.student?.user?.name ?? "—",
              feeType: receiptPayment.feeStructure?.name ?? "—",
              amount: receiptPayment.amount,
              method: receiptPayment.method,
              reference: receiptPayment.reference,
              paidAt: receiptPayment.paidAt,
              recordedBy: receiptPayment.recordedBy?.name ?? "—",
            }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
