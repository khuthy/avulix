"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface ReceiptData {
  receiptNumber: string;
  schoolName: string;
  emis?: string;
  studentName: string;
  feeType: string;
  amount: number | string;
  method: string;
  reference?: string;
  paidAt: string | Date;
  recordedBy: string;
}

interface ReceiptPrintProps {
  receipt: ReceiptData;
}

export function ReceiptPrint({ receipt }: ReceiptPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print trigger (hidden in print) */}
      <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 no-print">
        <Printer className="w-4 h-4" />
        Print Receipt
      </Button>

      {/* Printable receipt — visible only when printing */}
      <div className="print-only" id="receipt-print-area">
        <style>{`
          @media print {
            body > * { display: none !important; }
            #receipt-print-area { display: block !important; }
          }
        `}</style>
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "420px", margin: "0 auto", padding: "32px", border: "1px solid #ccc" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px", borderBottom: "2px solid #1A2340", paddingBottom: "16px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#1A2340", margin: 0 }}>{receipt.schoolName}</h1>
            {receipt.emis && <p style={{ fontSize: "11px", color: "#666", margin: "4px 0 0" }}>EMIS: {receipt.emis}</p>}
            <p style={{ fontSize: "13px", color: "#C0392B", marginTop: "6px", fontWeight: "600" }}>OFFICIAL RECEIPT</p>
          </div>

          {/* Receipt number */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Receipt No.</span>
            <strong style={{ fontSize: "13px" }}>{receipt.receiptNumber}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Date</span>
            <span style={{ fontSize: "12px" }}>{formatDateTime(receipt.paidAt)}</span>
          </div>

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />

          {/* Details table */}
          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Student", receipt.studentName],
                ["Fee Type", receipt.feeType],
                ["Payment Method", receipt.method],
                ...(receipt.reference ? [["Reference", receipt.reference]] : []),
                ["Recorded By", receipt.recordedBy],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ padding: "6px 0", color: "#666", width: "40%" }}>{label}</td>
                  <td style={{ padding: "6px 0", fontWeight: "500" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />

          {/* Amount */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", backgroundColor: "#F5F6F8" }}>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>AMOUNT PAID</span>
            <strong style={{ fontSize: "18px", color: "#8DB531" }}>{formatCurrency(receipt.amount)}</strong>
          </div>

          {/* QR placeholder */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", border: "2px dashed #ccc", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "9px", color: "#aaa" }}>QR</span>
            </div>
            <p style={{ fontSize: "9px", color: "#aaa", marginTop: "4px" }}>Scan to verify</p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#999", borderTop: "1px solid #eee", paddingTop: "12px" }}>
            <p>Thank you for your payment.</p>
            <p style={{ marginTop: "4px" }}>Powered by Avulix ISAMS — Danho Systems</p>
          </div>
        </div>
      </div>
    </>
  );
}
