"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, CheckCircle2, Loader2, Zap } from "lucide-react";

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

const sources = [
  "Google Search",
  "Social Media",
  "Word of Mouth",
  "Education Conference",
  "Department of Education",
  "Other",
];

export default function ContactPage() {
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
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: "64px" }}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Left sidebar */}
        <div
          className="lg:w-2/5 px-8 py-16 lg:px-12 lg:py-24 flex flex-col justify-center"
          style={{ backgroundColor: "#1A2340" }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
            Let&apos;s get your school{" "}
            <span style={{ color: "#8DB531" }}>set up</span>
          </h1>
          <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
            Fill out the form and a member of our team will be in touch within 24 hours to
            walk you through Avulix and get your school started.
          </p>

          <div className="space-y-5 mb-10">
            <a
              href="mailto:hello@avulix.co.za"
              className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <Mail className="w-5 h-5 text-white/70" />
              </div>
              hello@avulix.co.za
            </a>
            <a
              href="tel:+27000000000"
              className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <Phone className="w-5 h-5 text-white/70" />
              </div>
              +27 (0) 00 000 0000
            </a>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <MapPin className="w-5 h-5 text-white/70" />
              </div>
              South Africa
            </div>
          </div>

          {/* Response badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold w-fit"
            style={{ backgroundColor: "rgba(141,181,49,0.15)", color: "#AEDB44" }}
          >
            <Zap className="w-4 h-4" />
            We respond within 24 hours
          </div>
        </div>

        {/* Right: form */}
        <div className="lg:w-3/5 px-6 py-12 lg:px-16 lg:py-24 bg-white flex items-center">
          {submitted ? (
            <div className="max-w-md mx-auto text-center w-full">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#EEF7D6" }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: "#8DB531" }} />
              </div>
              <h2 className="text-3xl font-extrabold mb-3" style={{ color: "#1A2340" }}>
                Message received!
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#4A5168" }}>
                Thank you for reaching out. A member of our team will be in touch within 24 hours
                to discuss how Avulix can help your school.
              </p>
              <div className="mt-6 p-4 rounded-xl text-sm" style={{ backgroundColor: "#F5F6F8", color: "#9DA3B4" }}>
                🇿🇦 Built for South African schools — we get the context
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto w-full space-y-5">
              <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#1A2340" }}>
                Contact us
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name*" error={errors.name}>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Jane Dlamini" className={inputCls(!!errors.name)} />
                </Field>
                <Field label="School Name*" error={errors.school}>
                  <input name="school" value={form.school} onChange={handleChange}
                    placeholder="Sunrise Primary School" className={inputCls(!!errors.school)} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address*" error={errors.email}>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="jane@school.co.za" className={inputCls(!!errors.email)} />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+27 82 000 0000" className={inputCls(!!errors.phone)} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your Role" error={errors.role}>
                  <select name="role" value={form.role} onChange={handleChange}
                    className={inputCls(!!errors.role)}>
                    <option value="">Select role...</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="How did you hear about us?" error={errors.source}>
                  <select name="source" value={form.source} onChange={handleChange}
                    className={inputCls(!!errors.source)}>
                    <option value="">Select source...</option>
                    {sources.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Message*" error={errors.message}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your school and what you're looking for..."
                  className={inputCls(!!errors.message) + " resize-none"}
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#C0392B" }}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                ) : (
                  "Send Message"
                )}
              </button>

              <p className="text-xs text-center" style={{ color: "#9DA3B4" }}>
                By submitting this form you agree to our privacy policy. We process data in accordance with POPIA (Act 4 of 2013).
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
    hasError
      ? "border-[#C0392B] bg-[#FDECEA]"
      : "border-gray-200 bg-gray-50 focus:border-[#1A2340] focus:bg-white"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A5168" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs" style={{ color: "#C0392B" }}>{error}</p>}
    </div>
  );
}
