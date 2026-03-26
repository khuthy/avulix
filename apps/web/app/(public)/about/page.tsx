import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/ui/FadeUp";
import { ArrowRight, Heart, Leaf, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Avulix",
  description:
    "Avulix is powered by Danho Systems — a South African edtech company on a mission to rebuild the education value chain through technology.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-[56px] font-extrabold text-white leading-tight mb-6">
            We believe every South African learner deserves a{" "}
            <span style={{ color: "#8DB531" }}>well-run school</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Avulix was built out of frustration with the state of school administration software in
            South Africa — and a deep conviction that we can do better.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Purpose */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl font-extrabold" style={{ color: "#1A2340" }}>Our Foundation</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Mission",
                content:
                  "To empower South African schools with world-class administration tools that are affordable, simple, and built for local context.",
                color: "#C0392B",
                bg: "#FDECEA",
              },
              {
                label: "Vision",
                content:
                  "A South Africa where every school — regardless of quintile or budget — has access to the technology needed to deliver quality education.",
                color: "#8DB531",
                bg: "#EEF7D6",
              },
              {
                label: "Purpose",
                content:
                  "Rebuilding the education value chain, one school at a time — so that administrators can spend less time on paperwork and more time on learners.",
                color: "#1A2340",
                bg: "#E8EAF0",
              },
            ].map(({ label, content, color, bg }, i) => (
              <FadeUp key={label} delay={i * 100}>
                <div className="rounded-2xl p-8 h-full" style={{ backgroundColor: bg }}>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ backgroundColor: color, color: "white" }}
                  >
                    {label}
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: "#4A5168" }}>{content}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Triple bottom line */}
      <section className="py-24 px-4" style={{ backgroundColor: "#F5F6F8" }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl font-extrabold" style={{ color: "#1A2340" }}>
              Our Triple Bottom Line
            </h2>
            <p className="mt-3 text-lg" style={{ color: "#4A5168" }}>
              We measure success by more than profit.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                label: "People",
                desc: "Every learner, teacher, and family that benefits from a better-run school is a win for our mission.",
                color: "#C0392B",
              },
              {
                icon: Leaf,
                label: "Planet",
                desc: "Digital-first operations reduce paper waste and the carbon footprint of school administration.",
                color: "#8DB531",
              },
              {
                icon: TrendingUp,
                label: "Profit",
                desc: "A sustainable business model that allows us to reinvest in product, support, and community impact.",
                color: "#1A2340",
              },
            ].map(({ icon: Icon, label, desc, color }, i) => (
              <FadeUp key={label} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center hover:-translate-y-1 transition-transform">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-3" style={{ color: "#1A2340" }}>{label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9DA3B4" }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholders */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="text-4xl font-extrabold" style={{ color: "#1A2340" }}>Meet the team</h2>
            <p className="mt-3 text-lg" style={{ color: "#4A5168" }}>
              Built by educators, technologists, and problem solvers who care deeply about South African education.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { initials: "DM", name: "Danho Muendane", role: "Founder & CEO" },
              { initials: "NM", name: "Nandi Mthembu", role: "Head of Product" },
              { initials: "ST", name: "Sipho Thole", role: "Lead Engineer" },
            ].map(({ initials, name, role }, i) => (
              <FadeUp key={name} delay={i * 100}>
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold text-white"
                    style={{ backgroundColor: "#1A2340" }}
                  >
                    {initials}
                  </div>
                  <h3 className="font-bold text-base" style={{ color: "#1A2340" }}>{name}</h3>
                  <p className="text-sm" style={{ color: "#9DA3B4" }}>{role}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Powered by Danho Systems */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            Powered by
          </p>
          <h3 className="text-3xl font-extrabold text-white mb-4">Danho Systems</h3>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            A South African technology company building digital infrastructure for the education sector.
            Avulix is our flagship product — the school operating system South Africa has been waiting for.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#C0392B" }}
          >
            Partner with us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
