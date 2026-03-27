"use client";

import Link from "next/link";
import { AvulixLogo } from "@/components/ui/avulix-logo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, UserCheck, ClipboardList, GraduationCap,
  CreditCard, Wallet, AlertCircle, BookOpen, Package, Bus,
  BarChart3, Settings, Shield, LogOut, ChevronRight, X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "LEARNERS",
    items: [
      { href: "/students", label: "Students", icon: GraduationCap },
      { href: "/attendance", label: "Attendance", icon: UserCheck },
      { href: "/admissions", label: "Admissions", icon: ClipboardList },
    ],
  },
  {
    title: "PEOPLE",
    items: [{ href: "/staff", label: "Staff", icon: Users }],
  },
  {
    title: "FINANCE",
    items: [
      { href: "/finance/fees", label: "Fees", icon: CreditCard },
      { href: "/finance/payments", label: "Payments", icon: Wallet },
      { href: "/finance/debtors", label: "Debtors", icon: AlertCircle },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      { href: "/library", label: "Library", icon: BookOpen },
      { href: "/inventory", label: "Inventory", icon: Package },
      { href: "/transport", label: "Transport", icon: Bus },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/settings/school", label: "Settings", icon: Settings },
      { href: "/audit-log", label: "Audit Log", icon: Shield },
    ],
  },
];

interface SidebarProps {
  role: string;
  userName: string;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role, userName, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const adminOnlyItems = ["/audit-log", "/settings"];
  const canSee = (href: string) => {
    if (adminOnlyItems.some((p) => href.startsWith(p))) {
      return ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(role);
    }
    return true;
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={cn(
        "flex flex-col w-64 flex-shrink-0 overflow-y-auto",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0 md:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{
        backgroundColor: "#1A2340",
        backgroundImage: `radial-gradient(circle, #2E3F6F 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0",
      }}
    >
      {/* Logo + mobile close */}
      <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex flex-col gap-1">
          <AvulixLogo variant="dark" size="sm" />
          <p className="text-[9px] font-medium pl-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Powered by Danho Systems
          </p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => canSee(item.href));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                          active
                            ? "text-white"
                            : "text-white/55 hover:text-white hover:bg-white/8"
                        )}
                        style={
                          active
                            ? {
                                backgroundColor: "rgba(192,57,43,0.18)",
                                borderLeft: "3px solid #C0392B",
                                paddingLeft: "10px",
                              }
                            : {}
                        }
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            active ? "text-[#C0392B]" : "text-white/40 group-hover:text-white/70"
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight className="w-3 h-3 text-[#C0392B]" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User area */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#C0392B" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-none mb-0.5">{userName}</p>
            <span
              className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
              style={{ backgroundColor: "rgba(141,181,49,0.2)", color: "#AEDB44" }}
            >
              {role.replace("_", " ")}
            </span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm rounded-xl transition-colors"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "white";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
