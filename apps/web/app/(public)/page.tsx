import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeUp } from "@/components/ui/FadeUp";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { FeaturesTabShowcase } from "@/components/public/FeaturesTabShowcase";
import {
  CheckCircle2, FileText, DollarSign, Users, BarChart3,
  Play, Star, ArrowRight, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Avulix ISAMS — School Operating System for South Africa",
  description:
    "Avulix connects school administration, learning support, finance, and parent engagement in one secure, affordable platform. Built for South African schools.",
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── SECTION 1: HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16"
        style={{ backgroundColor: "#1A2340" }}
      >
        {/* Diagonal grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232E3F6F' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
            style={{ backgroundColor: "#EEF7D6", color: "#1A2340" }}>
            🇿🇦&nbsp; Built for South African Schools
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            The School Operating System{" "}
            <span style={{ color: "#8DB531" }}>South Africa</span> Needs
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            Avulix connects school administration, learning support, finance, and parent engagement
            in one secure, affordable platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/contact"
              className="flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              style={{ backgroundColor: "#C0392B" }}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg border-2 border-white/30 hover:border-white/60 transition-all"
            >
              <Play className="w-5 h-5" fill="white" />
              Watch Demo
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.55)" }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#8DB531]" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#8DB531]" /> POPIA compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#8DB531]" /> Setup in 30 minutes</span>
          </div>

          {/* Hero mockup */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transform: "rotate(1deg)",
                boxShadow: "0 0 60px 0 rgba(141,181,49,0.15), 0 25px 50px -12px rgba(0,0,0,0.5)",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ backgroundColor: "#0D1220" }}>
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md px-3 flex items-center text-[10px]"
                    style={{ backgroundColor: "#1A2340", color: "rgba(255,255,255,0.4)" }}>
                    app.avulix.co.za/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard mockup */}
              <div className="p-5 grid grid-cols-4 gap-3" style={{ backgroundColor: "#F5F6F8" }}>
                <div className="col-span-4 flex items-center justify-between mb-1">
                  <div className="h-5 w-48 rounded" style={{ backgroundColor: "#E2E4EA" }} />
                  <div className="h-8 w-28 rounded-full" style={{ backgroundColor: "#C0392B" }} />
                </div>
                {[
                  { color: "#EEF7D6", accent: "#8DB531", label: "Students", val: "1,240" },
                  { color: "#E8EAF0", accent: "#1A2340", label: "Staff", val: "87" },
                  { color: "#FDECEA", accent: "#C0392B", label: "Debtors", val: "R84k" },
                  { color: "#EEF7D6", accent: "#8DB531", label: "Attendance", val: "94%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 bg-white shadow-sm">
                    <div className="w-7 h-7 rounded-lg mb-2" style={{ backgroundColor: s.color }} />
                    <div className="h-3 w-16 rounded mb-1" style={{ backgroundColor: "#E2E4EA" }} />
                    <div className="text-lg font-bold" style={{ color: s.accent }}>{s.val}</div>
                  </div>
                ))}
                <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm">
                  <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: "#E2E4EA" }} />
                  {[70, 45, 85, 60].map((w, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <div className="h-2 rounded-full" style={{ width: `${w}%`, backgroundColor: "#8DB531" }} />
                    </div>
                  ))}
                </div>
                <div className="col-span-2 bg-white rounded-xl p-3 shadow-sm">
                  <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: "#E2E4EA" }} />
                  {["Jane Mokoena", "Sipho Dlamini", "Thabo Nkosi"].map((name) => (
                    <div key={name} className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "#E8EAF0" }} />
                      <div className="h-2.5 rounded flex-1" style={{ backgroundColor: "#E2E4EA" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STATS BAR ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-y-2 divide-x-0 lg:divide-y-0 lg:divide-x-2 divide-gray-100">
            {[
              { target: 2400, suffix: "+", label: "Learners Managed" },
              { target: 18, suffix: "+", label: "Schools Onboarded" },
              { target: 98, suffix: "%", label: "Admin Time Saved" },
              { target: 0, prefix: "R", label: "Setup Cost" },
            ].map(({ target, suffix, prefix, label }) => (
              <FadeUp key={label} className="flex flex-col items-center py-8 px-6 text-center">
                <p className="text-4xl sm:text-5xl font-extrabold" style={{ color: "#1A2340" }}>
                  <AnimatedCounter target={target} prefix={prefix} suffix={suffix} />
                </p>
                <p className="text-sm font-medium mt-2" style={{ color: "#9DA3B4" }}>{label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider topColor="#ffffff" bottomColor="#F5F6F8" />

      {/* ── SECTION 3: THE PROBLEM ── */}
      <section className="py-24 px-4" style={{ backgroundColor: "#F5F6F8" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-[44px] font-extrabold leading-tight" style={{ color: "#1A2340" }}>
              Schools are drowning in admin.{" "}
              <span style={{ color: "#C0392B" }}>Learners are falling through the cracks.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "#4A5168" }}>
              South African schools face massive administrative burdens with outdated tools.
              Avulix was built to change that — from the ground up.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📋", title: "Paper-based records", desc: "Student data lost, duplicated or inaccessible when you need it most." },
              { icon: "💸", title: "Fee collection chaos", desc: "No visibility into who's paid, who owes, and how much is at risk." },
              { icon: "👨‍👩‍👧", title: "Parents in the dark", desc: "Families disconnected from their child's progress and school updates." },
              { icon: "📊", title: "Compliance risks", desc: "Manual reporting creates SACE, DoE, and POPIA compliance gaps." },
            ].map(({ icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ borderLeftColor: "#C0392B" }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-bold text-base mb-1" style={{ color: "#1A2340" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9DA3B4" }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider topColor="#F5F6F8" bottomColor="#ffffff" />

      {/* ── SECTION 4: FEATURES TAB SHOWCASE ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl sm:text-[44px] font-extrabold" style={{ color: "#1A2340" }}>
              One platform. <span style={{ color: "#8DB531" }}>Ten powerful modules.</span>
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#4A5168" }}>
              Everything your school needs, designed to work together seamlessly.
            </p>
          </FadeUp>
          <FeaturesTabShowcase />
        </div>
      </section>

      <SectionDivider topColor="#ffffff" bottomColor="#1A2340" />

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <section className="py-24 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-5xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-[44px] font-extrabold text-white mb-4">
              Up and running in <span style={{ color: "#8DB531" }}>3 simple steps</span>
            </h2>
            <p className="text-lg mb-16" style={{ color: "rgba(255,255,255,0.6)" }}>
              No IT team required. No long implementation. Just results.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { num: "01", title: "Onboard your school", desc: "Fill in your school details. We configure your account, import existing data, and set up your modules in under 30 minutes." },
              { num: "02", title: "Invite your team", desc: "Add admins, teachers, and staff with role-based access. Everyone gets exactly what they need — nothing more." },
              { num: "03", title: "Go live today", desc: "Start managing learners, recording fees, tracking attendance, and engaging parents from day one. Zero disruption." },
            ].map(({ num, title, desc }, i) => (
              <FadeUp key={num} delay={i * 100}>
                <div className="relative rounded-2xl p-8 text-left"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                  <div className="text-5xl font-extrabold mb-4" style={{ color: "#8DB531" }}>{num}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#C0392B" }}
            >
              Start your free trial <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      <SectionDivider topColor="#1A2340" bottomColor="#FAFAF8" />

      {/* ── SECTION 6: TESTIMONIALS ── */}
      <section className="py-24 px-4" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl sm:text-[44px] font-extrabold" style={{ color: "#1A2340" }}>
              Trusted by schools across South Africa
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Avulix cut our admin time by 60%. What used to take us a full day now takes an hour. Our staff can actually focus on learners again.",
                name: "Nomvula Dlamini",
                role: "Principal, Johannesburg",
                initials: "ND",
              },
              {
                quote: "The fee tracking module alone has recovered over R200,000 in outstanding payments we didn't even know we had. Game changer.",
                name: "Thabo Mokoena",
                role: "Finance Manager, Cape Town",
                initials: "TM",
              },
              {
                quote: "Parents love getting WhatsApp updates. Our school community feels more connected than ever. Highly recommend Avulix to any school.",
                name: "Lindiwe Nkosi",
                role: "Deputy Principal, Durban",
                initials: "LN",
              },
            ].map(({ quote, name, role, initials }) => (
              <FadeUp key={name}>
                <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col h-full overflow-hidden">
                  <div className="h-1 w-full rounded-t-full mb-5 -mx-6 -mt-6 px-0" style={{ backgroundColor: "#8DB531", marginLeft: "-24px", marginRight: "-24px", marginTop: "-24px", width: "calc(100% + 48px)" }} />
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#4A5168" }}>
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: "#1A2340" }}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1A2340" }}>{name}</p>
                      <p className="text-xs" style={{ color: "#9DA3B4" }}>{role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CTA BANNER ── */}
      <section className="relative py-24 px-4 overflow-hidden" style={{ backgroundColor: "#C0392B" }}>
        {/* Diagonal lines pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to transform your school?
          </h2>
          <p className="text-lg mb-10 text-white/80">
            Join 18+ schools already using Avulix to simplify administration and improve outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "white", color: "#C0392B" }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white/10 transition-all"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
