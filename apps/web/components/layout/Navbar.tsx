"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div
                className={cn(
                  "transition-all duration-300",
                  !scrolled && "bg-white rounded-xl px-2 py-1"
                )}
              >
                <Image
                  src="/transparent_background_logo.png"
                  alt="Avulix"
                  width={110}
                  height={38}
                  className="object-contain h-9 w-auto"
                  priority
                />
              </div>
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
                      scrolled
                        ? isActive
                          ? "text-[#C0392B]"
                          : "text-gray-600 hover:text-[#1A2340]"
                        : isActive
                          ? "text-[#AEDB44]"
                          : "text-white/80 hover:text-white"
                    )}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: scrolled ? "#C0392B" : "#AEDB44" }}
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
                  scrolled
                    ? "border-gray-300 text-gray-700 hover:border-[#1A2340] hover:text-[#1A2340]"
                    : "border-white/40 text-white hover:border-white"
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
                scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
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
              <div className="bg-white rounded-xl px-2 py-1 inline-flex">
                <Image
                  src="/transparent_background_logo.png"
                  alt="Avulix"
                  width={100}
                  height={34}
                  className="object-contain h-8 w-auto"
                />
              </div>
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
