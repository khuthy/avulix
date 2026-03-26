"use client";

import { useState } from "react";
import {
  ClipboardList, GraduationCap, CreditCard, UserCheck,
  BookOpen, Bus, Users, BarChart3, Shield, Settings, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureTab {
  id: string;
  label: string;
  icon: React.ElementType;
  title: string;
  description: string;
  bullets: string[];
  color: string;
}

const tabs: FeatureTab[] = [
  {
    id: "admissions",
    label: "Admissions",
    icon: ClipboardList,
    title: "Streamlined Admissions",
    description: "Manage applications from first inquiry to enrolment in one place. No more paper forms or lost documents.",
    bullets: ["Online application tracking", "Automated status notifications", "Document upload & review"],
    color: "#C0392B",
  },
  {
    id: "students",
    label: "Students",
    icon: GraduationCap,
    title: "Learner Management",
    description: "Comprehensive student profiles with academic history, documents, and parent contact information.",
    bullets: ["Complete learner profiles", "Grade & subject tracking", "Export for SA-SAMS"],
    color: "#8DB531",
  },
  {
    id: "finance",
    label: "Finance",
    icon: CreditCard,
    title: "School Finance",
    description: "Manage fees, record payments, track debtors, and generate financial reports with ease.",
    bullets: ["Fee structure builder", "Payment receipts & history", "Automated debtor alerts"],
    color: "#1A2340",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: UserCheck,
    title: "Attendance Tracking",
    description: "Mark and monitor daily attendance digitally. Identify patterns and flag at-risk learners early.",
    bullets: ["Daily class roll call", "Absence trend reports", "Parent notifications"],
    color: "#8DB531",
  },
  {
    id: "library",
    label: "Library",
    icon: BookOpen,
    title: "Library Management",
    description: "Catalogue resources, track loans and returns, and manage overdue items across your school library.",
    bullets: ["Resource cataloguing", "Loan & return tracking", "Overdue reminders"],
    color: "#C0392B",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    title: "Transport Routing",
    description: "Manage school bus routes, assigned learners, and vehicle schedules in a single view.",
    bullets: ["Route & stop management", "Learner assignment", "Driver records"],
    color: "#1A2340",
  },
  {
    id: "staff",
    label: "Staff",
    icon: Users,
    title: "Staff Management",
    description: "Maintain complete HR records for teaching and non-teaching staff across all departments.",
    bullets: ["Staff profiles & roles", "Subject assignments", "Leave tracking (coming soon)"],
    color: "#8DB531",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Generate detailed reports on finance, attendance, admissions, and more — exportable to CSV.",
    bullets: ["Customisable dashboards", "CSV & PDF export", "DoE-aligned reporting"],
    color: "#C0392B",
  },
  {
    id: "audit",
    label: "Audit",
    icon: Shield,
    title: "Audit & Compliance",
    description: "Full audit trail of every action taken in the system. POPIA-compliant data governance built in.",
    bullets: ["Full action audit log", "User access controls", "POPIA compliance toolkit"],
    color: "#1A2340",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    title: "School Configuration",
    description: "Customise Avulix for your school — branding, academic year, fee structures, user roles, and more.",
    bullets: ["School profile & branding", "Academic year setup", "Role-based permissions"],
    color: "#8DB531",
  },
];

export function FeaturesTabShowcase() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;
  const Icon = current.icon;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border",
                isActive
                  ? "text-white border-transparent shadow-md"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
              )}
              style={isActive ? { backgroundColor: current.color, borderColor: current.color } : {}}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div key={current.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-fade-in-up">
        {/* Left: text */}
        <div>
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ backgroundColor: `${current.color}15` }}
          >
            <Icon className="w-7 h-7" style={{ color: current.color }} />
          </div>
          <h3 className="text-2xl font-extrabold mb-3" style={{ color: "#1A2340" }}>
            {current.title}
          </h3>
          <p className="text-base leading-relaxed mb-6" style={{ color: "#4A5168" }}>
            {current.description}
          </p>
          <ul className="space-y-3">
            {current.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#8DB531" }} />
                <span className="text-sm font-medium" style={{ color: "#4A5168" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: styled mockup preview */}
        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: `${current.color}08`, border: `2px solid ${current.color}20` }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: current.color }} />
            <span className="text-sm font-bold" style={{ color: current.color }}>{current.title}</span>
          </div>
          {/* Mock rows */}
          {[85, 60, 75, 50, 90].map((w, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: `${current.color}20` }} />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 rounded-full" style={{ width: `${w}%`, backgroundColor: `${current.color}25` }} />
                <div className="h-2 rounded-full" style={{ width: `${w * 0.6}%`, backgroundColor: "#E2E4EA" }} />
              </div>
              <div className="w-12 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: i % 2 === 0 ? "#EEF7D6" : "#FDECEA" }} />
            </div>
          ))}
          <div className="mt-4 pt-4 border-t flex items-center justify-between"
            style={{ borderColor: `${current.color}20` }}>
            <div className="h-7 w-24 rounded-full" style={{ backgroundColor: `${current.color}20` }} />
            <div className="h-7 w-20 rounded-full" style={{ backgroundColor: current.color }} />
          </div>
        </div>
      </div>

    </div>
  );
}
