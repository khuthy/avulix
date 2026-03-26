"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/FadeUp";
import { CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 1499,
    annualPrice: 1249,
    description: "Perfect for smaller schools getting started with digital administration.",
    color: "#1A2340",
    popular: false,
    features: [
      "Up to 150 learners",
      "Core modules (Students, Attendance, Finance)",
      "1 admin user",
      "Email support",
      "CSV exports",
      "POPIA compliance toolkit",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 2999,
    annualPrice: 2499,
    description: "Our most popular plan for growing schools that need the full suite.",
    color: "#8DB531",
    popular: true,
    features: [
      "Up to 500 learners",
      "All 10 modules included",
      "5 admin users",
      "WhatsApp notifications",
      "Priority support",
      "SA-SAMS export",
      "Advanced analytics",
      "Custom fee structures",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "For large schools and circuits with complex requirements and high learner volumes.",
    color: "#C0392B",
    popular: false,
    features: [
      "Unlimited learners",
      "Everything in Growth",
      "Dedicated account manager",
      "On-site training",
      "SLA guarantee",
      "Custom integrations",
      "Data migration support",
      "Multi-school management",
    ],
    cta: "Talk to Us",
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan starts with a 14-day free trial. No credit card required. You get full access to all features in your chosen plan so you can evaluate Avulix with your real school data.",
  },
  {
    q: "Can I import my existing school data?",
    a: "Absolutely. We support CSV imports for learners, staff, and fee structures. Our onboarding team will help you migrate data from your current system at no extra charge.",
  },
  {
    q: "Is Avulix POPIA compliant?",
    a: "Yes. Avulix was built with POPIA (Protection of Personal Information Act 4 of 2013) compliance from the ground up. All data is stored in South Africa, encrypted at rest and in transit, and we provide full data subject access request tooling.",
  },
  {
    q: "How many users can I add?",
    a: "Starter plans include 1 admin user. Growth plans include 5 admin users. Enterprise plans have unlimited users. Teachers and parents can be added as non-admin users at no extra cost on all plans.",
  },
  {
    q: "What happens after my trial ends?",
    a: "After your 14-day trial, you can choose a plan and continue. Your data is never deleted — we give you 30 days to decide and will export all your data on request if you choose not to continue.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4" style={{ backgroundColor: "#1A2340" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl sm:text-[56px] font-extrabold text-white leading-tight mb-5">
            Simple, transparent pricing{" "}
            <span style={{ color: "#8DB531" }}>for every school</span>
          </h1>
          <p className="text-xl mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
            No hidden fees. No per-user charges. Just one honest price for your whole school.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                !annual ? "bg-white text-[#1A2340]" : "text-white/70 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2",
                annual ? "bg-white text-[#1A2340]" : "text-white/70 hover:text-white"
              )}
            >
              Annual
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: "#8DB531", color: "white" }}
              >
                2 months free
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 80}>
                <div
                  className={cn(
                    "rounded-2xl p-8 relative overflow-hidden transition-all hover:shadow-xl",
                    plan.popular
                      ? "shadow-xl border-2"
                      : "border border-gray-100 shadow-sm"
                  )}
                  style={plan.popular ? { borderColor: plan.color, backgroundColor: "#1A2340" } : {}}
                >
                  {plan.popular && (
                    <div
                      className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-2xl"
                      style={{ backgroundColor: plan.color, color: "white" }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <h3
                    className="text-xl font-extrabold mb-1"
                    style={{ color: plan.popular ? "white" : "#1A2340" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ color: plan.popular ? "rgba(255,255,255,0.6)" : "#9DA3B4" }}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {plan.monthlyPrice ? (
                      <>
                        <span
                          className="text-5xl font-extrabold"
                          style={{ color: plan.popular ? "white" : "#1A2340" }}
                        >
                          R{annual ? plan.annualPrice?.toLocaleString() : plan.monthlyPrice?.toLocaleString()}
                        </span>
                        <span
                          className="text-base ml-1"
                          style={{ color: plan.popular ? "rgba(255,255,255,0.5)" : "#9DA3B4" }}
                        >
                          /mo
                        </span>
                        {annual && (
                          <p className="text-xs mt-1" style={{ color: plan.popular ? "#AEDB44" : "#8DB531" }}>
                            Billed annually — save R{((plan.monthlyPrice - (plan.annualPrice ?? 0)) * 12).toLocaleString()}/yr
                          </p>
                        )}
                      </>
                    ) : (
                      <span
                        className="text-4xl font-extrabold"
                        style={{ color: plan.popular ? "white" : "#1A2340" }}
                      >
                        Custom
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: plan.popular ? "#8DB531" : "#8DB531" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: plan.popular ? "rgba(255,255,255,0.8)" : "#4A5168" }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                    style={
                      plan.popular
                        ? { backgroundColor: plan.color, color: "white" }
                        : { backgroundColor: "#F5F6F8", color: "#1A2340" }
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4" style={{ backgroundColor: "#F5F6F8" }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <h2 className="text-4xl font-extrabold" style={{ color: "#1A2340" }}>
              Frequently asked questions
            </h2>
          </FadeUp>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <h3 className="font-semibold text-sm" style={{ color: "#1A2340" }}>
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 transition-transform"
                      style={{
                        color: "#9DA3B4",
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: "#4A5168" }}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: "#1A2340" }}>
            Still have questions?
          </h2>
          <p className="mb-8" style={{ color: "#9DA3B4" }}>
            Our team is happy to walk you through the right plan for your school.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#C0392B" }}
          >
            Talk to us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
