import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Wallet, AlertCircle, UserCheck,
  ClipboardList, Users, Download, Info,
} from "lucide-react";
import Link from "next/link";

const REPORTS = [
  {
    id: "learner-register",
    icon: GraduationCap,
    title: "Learner Register",
    description: "Full list of enrolled learners by grade with personal and guardian details.",
    href: "/api/students",
    color: "navy",
  },
  {
    id: "fee-collection",
    icon: Wallet,
    title: "Fee Collection Summary",
    description: "Summary of payments collected per fee type and term.",
    href: "/api/finance/payments",
    color: "lime",
  },
  {
    id: "debtors",
    icon: AlertCircle,
    title: "Outstanding Debtors",
    description: "List of learners with outstanding fee balances and days overdue.",
    href: "/api/finance/debtors",
    color: "red",
  },
  {
    id: "attendance",
    icon: UserCheck,
    title: "Attendance Summary",
    description: "Attendance statistics by grade and date range.",
    href: "/api/attendance",
    color: "lime",
  },
  {
    id: "admissions",
    icon: ClipboardList,
    title: "Admissions Pipeline",
    description: "Application counts by status — pending, reviewing, accepted, rejected.",
    href: "/api/admissions",
    color: "gray",
  },
  {
    id: "staff-directory",
    icon: Users,
    title: "Staff Directory",
    description: "Complete staff list with departments, positions, and contact information.",
    href: "/api/staff",
    color: "navy",
  },
];

const colorConfig: Record<string, { bg: string; icon: string }> = {
  navy: { bg: "#E8EAF0", icon: "#1A2340" },
  lime: { bg: "#EEF7D6", icon: "#637F22" },
  red: { bg: "#FDECEA", icon: "#C0392B" },
  gray: { bg: "#F5F6F8", icon: "#4A5168" },
};

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Generate and export school reports" />

      {/* SA-SAMS notice */}
      <div className="mb-6 flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: "#E8EAF0", borderColor: "#1A234030" }}>
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1A2340" }} />
        <p className="text-sm" style={{ color: "#1A2340" }}>
          <strong>Coming Soon:</strong> SA-SAMS & LURITS compliant export formats for Department of Education submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((report) => {
          const cfg = colorConfig[report.color];
          return (
            <div key={report.id} className="bg-white rounded-xl border shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: cfg.bg }}>
                  <report.icon className="w-5 h-5" style={{ color: cfg.icon }} />
                </div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
              </div>
              <p className="text-sm text-gray-500 flex-1 mb-4">{report.description}</p>
              <Link href={report.href + "?export=csv"} target="_blank">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Generate Report
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
