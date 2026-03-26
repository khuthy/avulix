"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

interface TopNavProps {
  userName: string;
  role: string;
  onMenuToggle: () => void;
}

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL_ADMIN: "School Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/students": "Students",
    "/admissions": "Admissions",
    "/attendance": "Attendance",
    "/staff": "Staff",
    "/finance/fees": "Fees",
    "/finance/payments": "Payments",
    "/finance/debtors": "Debtors",
    "/library": "Library",
    "/inventory": "Inventory",
    "/transport": "Transport",
    "/reports": "Reports",
    "/audit-log": "Audit Log",
    "/settings/school": "School Settings",
    "/settings/users": "User Settings",
  };
  for (const [path, title] of Object.entries(map)) {
    if (pathname === path || pathname.startsWith(path + "/")) return title;
  }
  return "Avulix";
}

export function TopNav({ userName, role, onMenuToggle }: TopNavProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b flex-shrink-0"
      style={{ borderColor: "#E2E4EA" }}>
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl transition-colors hover:bg-gray-50"
          style={{ color: "#4A5168" }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <h1 className="text-base font-bold hidden sm:block" style={{ color: "#1A2340" }}>
          {pageTitle}
        </h1>

        {/* Search — md+ */}
        <div
          className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 ml-4"
          style={{ backgroundColor: "#F5F6F8", minWidth: "220px" }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#9DA3B4" }} />
          <input
            type="text"
            placeholder="Search students, staff..."
            className="text-sm bg-transparent outline-none flex-1 placeholder:text-gray-400"
            style={{ color: "#4A5168" }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="relative p-2 rounded-xl transition-colors hover:bg-gray-50"
          style={{ color: "#4A5168" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
            style={{ backgroundColor: "#C0392B" }}
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#1A2340" }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none" style={{ color: "#1F2533" }}>{userName}</p>
            <p className="text-xs mt-0.5" style={{ color: "#9DA3B4" }}>{roleLabel[role] ?? role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
