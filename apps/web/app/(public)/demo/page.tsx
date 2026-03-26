import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/ui/FadeUp";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Demo | Avulix ISAMS",
  description: "See Avulix in action. Watch a live demo of the school management platform built for South African schools.",
};

const highlights = [
  "Manage 1,000+ learners with ease",
  "Real-time financial dashboards",
  "Automated parent notifications",
  "POPIA-compliant data handling",
  "SA-SAMS compatible exports",
  "Works on any device, anywhere",
];

export default function DemoPage() {
  return (
    <div>
      <section className="pt-32 pb-20 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-[56px] font-extrabold text-white leading-tight mb-5">
            See Avulix <span style={{ color: "#8DB531" }}>in action</span>
          </h1>
          <p className="text-xl mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Watch how South African schools are using Avulix to simplify administration
            and improve learning outcomes.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Video placeholder */}
          <FadeUp>
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center cursor-pointer group"
              style={{ backgroundColor: "#1A2340" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A2340] to-[#0D1220]" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: "#C0392B" }}
                >
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
                <p className="text-white/60 text-sm font-medium">Click to play — 4 min overview</p>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(141,181,49,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(141,181,49,0.5) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }} />
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={100} className="text-center mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg transition-all hover:opacity-90"
              style={{ backgroundColor: "#C0392B" }}
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm mt-3" style={{ color: "#9DA3B4" }}>
              No credit card required · Setup in 30 minutes
            </p>
          </FadeUp>

          {/* Feature highlights */}
          <FadeUp delay={150} className="mt-16">
            <h2 className="text-2xl font-extrabold text-center mb-8" style={{ color: "#1A2340" }}>
              What you&apos;ll see in the demo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#F5F6F8" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#8DB531" }} />
                  <span className="text-sm font-medium" style={{ color: "#4A5168" }}>{h}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
