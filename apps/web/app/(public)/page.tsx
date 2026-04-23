"use client";

import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  school: z.string().min(2, "School name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  role: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  source: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

const roles = [
  "Principal",
  "Deputy Principal",
  "School Administrator",
  "Finance Manager",
  "Teacher",
  "Bursar",
  "Circuit Manager",
  "Other",
];

export default function ConstructionPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    school: "",
    email: "",
    phone: "",
    role: "",
    message: "",
    source: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        errs[field] = err.message;
      });
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F7F8FA", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── TOP BAR ── */}
      <header className="w-full px-6 py-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50L35 10L60 50L35 90L10 50Z" fill="#C0392B" />
              <path d="M40 50L65 10L90 50L65 90L40 50Z" fill="#1A2340" />
              <path d="M40 50L50 34L60 50L50 66L40 50Z" fill="#8DB531" />
            </svg>
          </div>
          <span
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: "#1A2340", letterSpacing: "-0.03em" }}
          >
            Avuli<span style={{ color: "#C0392B" }}>X</span>
          </span>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border"
              style={{ color: "#C0392B", borderColor: "#C0392B", backgroundColor: "#FDECEA" }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#C0392B" }}
              />
              Site Under Construction
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6"
            style={{ color: "#1A2340", letterSpacing: "-0.03em" }}
          >
            We&rsquo;re building something{" "}
            <span style={{ color: "#8DB531" }}>remarkable</span> for South African schools.
          </h1>

          {/* Subtext */}
          <p
            className="text-center text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto"
            style={{ color: "#4A5168" }}
          >
            Avulix is a comprehensive school management platform connecting administration,
            finance, and parent engagement in one secure, affordable system.
            Our full site is on its way — in the meantime, reach out below.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ backgroundColor: "#E2E4EA" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9DA3B4" }}>
              Get in Touch
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#E2E4EA" }} />
          </div>

          {/* Contact Form */}
          {submitted ? (
            <div
              className="rounded-2xl border p-10 text-center"
              style={{ backgroundColor: "#fff", borderColor: "#E2E4EA" }}
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "#8DB531" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "#1A2340" }}>
                Message received!
              </h2>
              <p className="text-sm" style={{ color: "#4A5168" }}>
                Thank you for reaching out. We&rsquo;ll be in touch with you shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border p-8 sm:p-10 space-y-5"
              style={{ backgroundColor: "#fff", borderColor: "#E2E4EA" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                    Full Name <span style={{ color: "#C0392B" }}>*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Dlamini"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      borderColor: errors.name ? "#C0392B" : "#E2E4EA",
                      color: "#1F2533",
                      backgroundColor: "#F7F8FA",
                    }}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{errors.name}</p>}
                </div>

                {/* School */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                    School Name <span style={{ color: "#C0392B" }}>*</span>
                  </label>
                  <input
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    placeholder="Sunshine Primary School"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      borderColor: errors.school ? "#C0392B" : "#E2E4EA",
                      color: "#1F2533",
                      backgroundColor: "#F7F8FA",
                    }}
                  />
                  {errors.school && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{errors.school}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                    Email Address <span style={{ color: "#C0392B" }}>*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@school.co.za"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      borderColor: errors.email ? "#C0392B" : "#E2E4EA",
                      color: "#1F2533",
                      backgroundColor: "#F7F8FA",
                    }}
                  />
                  {errors.email && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+27 12 345 6789"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      borderColor: "#E2E4EA",
                      color: "#1F2533",
                      backgroundColor: "#F7F8FA",
                    }}
                  />
                </div>

                {/* Role */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                    Your Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all appearance-none"
                    style={{
                      borderColor: "#E2E4EA",
                      color: form.role ? "#1F2533" : "#9DA3B4",
                      backgroundColor: "#F7F8FA",
                    }}
                  >
                    <option value="">Select your role...</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#4A5168" }}>
                  Message <span style={{ color: "#C0392B" }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your school and what you're looking for..."
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all resize-none"
                  style={{
                    borderColor: errors.message ? "#C0392B" : "#E2E4EA",
                    color: "#1F2533",
                    backgroundColor: "#F7F8FA",
                  }}
                />
                {errors.message && <p className="text-xs mt-1" style={{ color: "#C0392B" }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: "#1A2340",
                  color: "#fff",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full px-6 py-8 border-t" style={{ borderColor: "#E2E4EA" }}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#9DA3B4" }}>
            © {new Date().getFullYear()} Avulix · Danho Systems (Pty) Ltd · South Africa
          </p>
          <p className="text-xs" style={{ color: "#9DA3B4" }}>
            info@avulix.co.za
          </p>
        </div>
      </footer>
    </div>
  );
}
