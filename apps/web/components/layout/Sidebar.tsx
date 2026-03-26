"use client";

import Image from "next/image";
import Link from "next/link";
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

  return (
    <aside
      className={cn(
        // Base styles
        "flex flex-col w-64 flex-shrink-0 sidebar-scroll overflow-y-auto",
        // Mobile: fixed overlay drawer
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
        "md:relative md:translate-x-0 md:z-auto",
        // Toggle on mobile
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ backgroundColor: "#1A2340" }}
    >
      {/* Logo + mobile close button */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <Image src="/transparent_background_logo.png" alt="Avulix" width={120} height={54} className="object-contain" priority />
          <p className="text-[10px] text-white/50 leading-none mt-1">Powered by Danho Systems</p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded text-white/50 hover:text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => canSee(item.href));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.title}>
              <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-white/40 uppercase">
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
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                          active
                            ? "text-white border-l-2 border-[#C0392B] pl-2.5"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                        )}
                        style={active ? { backgroundColor: "rgba(192, 57, 43, 0.15)" } : {}}
                      >
                        <item.icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-[#C0392B]" : "text-white/50 group-hover:text-white/80")} />
                        {item.label}
                        {active && <ChevronRight className="w-3 h-3 ml-auto text-[#C0392B]" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#C0392B" }}>
            {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-[11px] text-white/50 truncate">{role.replace("_", " ")}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
