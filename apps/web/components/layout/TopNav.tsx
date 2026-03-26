"use client";

import { Bell, Menu, Search } from "lucide-react";

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

export function TopNav({ userName, role, onMenuToggle }: TopNavProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search — hidden on mobile, visible md+ */}
        <div className="hidden md:flex items-center gap-2 w-72">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students, staff..."
            className="text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-400 w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#C0392B" }} />
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#1A2340" }}
          >
            {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">{userName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{roleLabel[role] ?? role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
