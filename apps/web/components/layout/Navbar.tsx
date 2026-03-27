"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvulixLogo } from "@/components/ui/avulix-logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

// Pages with a full-width dark hero — navbar can be transparent at top
const DARK_HERO_PATHS = new Set(["/"]);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Transparent only when at the top of a page that has a dark hero
  const isTransparent = !scrolled && DARK_HERO_PATHS.has(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <AvulixLogo variant={isTransparent ? "dark" : "light"} size="md" />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      isTransparent
                        ? isActive
                          ? "text-[#AEDB44]"
                          : "text-white/80 hover:text-white"
                        : isActive
                          ? "text-[#C0392B]"
                          : "text-gray-600 hover:text-[#1A2340]"
                    )}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: isTransparent ? "#AEDB44" : "#C0392B" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full border transition-all",
                  isTransparent
                    ? "border-white/40 text-white hover:border-white"
                    : "border-gray-300 text-gray-700 hover:border-[#1A2340] hover:text-[#1A2340]"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 text-sm font-bold rounded-full text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#C0392B" }}
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                isTransparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ backgroundColor: "#1A2340" }}
        >
          <div className="flex flex-col gap-2 p-6">
            {/* Mobile overlay logo */}
            <div className="mb-2">
              <AvulixLogo variant="dark" size="md" />
            </div>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center px-4 py-4 rounded-xl text-white text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
              <Link
                href="/login"
                className="px-4 py-3 text-center text-white border border-white/30 rounded-full font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-center text-white rounded-full font-bold"
                style={{ backgroundColor: "#C0392B" }}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
