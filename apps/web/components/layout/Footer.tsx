import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { AvulixLogo } from "@/components/ui/avulix-logo";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "Admissions", href: "/features#admissions" },
    { label: "Finance", href: "/features#finance" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "POPIA Compliance", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A2340" }}>
      {/* Lime top accent line */}
      <div className="h-1 w-full" style={{ backgroundColor: "#8DB531" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Avulix */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <AvulixLogo variant="dark" size="md" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Rebuilding the education value chain, one school at a time.
            </p>
            <p className="text-xs mt-3 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
              Powered by Danho Systems
            </p>

            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@avulix.co.za"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <Mail className="w-4 h-4" />
                hello@avulix.co.za
              </a>
              <a
                href="tel:+27000000000"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <Phone className="w-4 h-4" />
                +27 (0) 00 000 0000
              </a>
              <div
                className="flex items-start gap-2 text-sm"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>South Africa</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* POPIA badge */}
            <div
              className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(141,181,49,0.15)", color: "#AEDB44" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#8DB531]" />
              POPIA Compliant
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} Avulix ISAMS. All rights reserved. Built for South African Schools.
          </p>
          <div className="flex items-center gap-4">
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              🇿🇦 Made in South Africa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
