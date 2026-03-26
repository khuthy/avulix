import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/ui/FadeUp";
import {
  ClipboardList, GraduationCap, CreditCard, UserCheck,
  BookOpen, Bus, Users, BarChart3, Shield, Settings, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features | Avulix ISAMS",
  description:
    "Every tool your South African school needs — admissions, students, finance, attendance, library, transport, staff, reports, audit, and settings.",
};

const modules = [
  {
    icon: ClipboardList,
    name: "Admissions",
    description: "Manage applications from inquiry to enrolment. Track status, review documents, and communicate with families — all in one place.",
    color: "#C0392B",
    bg: "#FDECEA",
  },
  {
    icon: GraduationCap,
    name: "Student Management",
    description: "Comprehensive learner profiles with academic history, documents, and parent contacts. Export directly to SA-SAMS.",
    color: "#8DB531",
    bg: "#EEF7D6",
  },
  {
    icon: CreditCard,
    name: "Finance & Fees",
    description: "Build fee structures, record payments, issue receipts, and generate debtor reports. Full financial visibility at your fingertips.",
    color: "#1A2340",
    bg: "#E8EAF0",
  },
  {
    icon: UserCheck,
    name: "Attendance",
    description: "Digital roll call for every class. Monitor trends, flag at-risk learners, and notify parents of absences automatically.",
    color: "#8DB531",
    bg: "#EEF7D6",
  },
  {
    icon: BookOpen,
    name: "Library",
    description: "Catalogue books and resources, track loans and returns, send overdue reminders, and gain full visibility into your library.",
    color: "#C0392B",
    bg: "#FDECEA",
  },
  {
    icon: Bus,
    name: "Transport",
    description: "Manage bus routes, stops, assigned learners, and vehicle details. Keep your transport operation organised and safe.",
    color: "#1A2340",
    bg: "#E8EAF0",
  },
  {
    icon: Users,
    name: "Staff Management",
    description: "Maintain HR records for teaching and non-teaching staff. Assign subjects, manage roles, and track staff information.",
    color: "#8DB531",
    bg: "#EEF7D6",
  },
  {
    icon: BarChart3,
    name: "Reports & Analytics",
    description: "Generate reports on finance, attendance, admissions, and more. Export to CSV or PDF. DoE-aligned reporting built in.",
    color: "#C0392B",
    bg: "#FDECEA",
  },
  {
    icon: Shield,
    name: "Audit & Compliance",
    description: "Full audit trail of every system action. Role-based access controls and a POPIA compliance toolkit keep you protected.",
    color: "#1A2340",
    bg: "#E8EAF0",
  },
  {
    icon: Settings,
    name: "School Configuration",
    description: "Customise Avulix for your school — branding, academic year, fee structures, grade configuration, and user permissions.",
    color: "#8DB531",
    bg: "#EEF7D6",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: "#EEF7D6", color: "#1A2340" }}
          >
            10 Powerful Modules
          </div>
          <h1 className="text-5xl sm:text-[56px] font-extrabold text-white leading-tight mb-5">
            Every tool your school needs —{" "}
            <span style={{ color: "#8DB531" }}>in one place</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Avulix brings 10 school management modules together in a single, unified platform —
            purpose-built for South African schools.
          </p>
        </div>
      </section>

      {/* Modules grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(({ icon: Icon, name, description, color, bg }, i) => (
              <FadeUp key={name} delay={i * 60}>
                <div
                  className="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2" style={{ color: "#1A2340" }}>{name}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#9DA3B4" }}>{description}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-bold transition-colors"
                    style={{ color }}
                  >
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F5F6F8" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: "#1A2340" }}>
            Ready to get all 10 modules?
          </h2>
          <p className="text-base mb-8" style={{ color: "#4A5168" }}>
            Start your free trial today. No credit card required, no setup fee.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90"
            style={{ backgroundColor: "#C0392B" }}
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
