"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Navy panel */}
      <div
        className="hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ backgroundColor: "#1A2340" }}
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #2E3F6F 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-16">
            <div className="bg-white rounded-xl px-3 py-2 inline-flex">
              <Image
                src="/transparent_background_logo.png"
                alt="Avulix"
                width={120}
                height={42}
                className="object-contain h-10 w-auto"
                priority
              />
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            South Africa&apos;s school operating system
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
            Manage learners, finances, attendance, and more — all from one place.
          </p>

          {/* Features list */}
          <div className="mt-10 space-y-4">
            {[
              "POPIA-compliant data protection",
              "Built for all quintile schools",
              "SA-SAMS compatible exports",
              "Setup in under 30 minutes",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(141,181,49,0.2)" }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#8DB531" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Powered by Danho Systems · 🇿🇦 Built in South Africa
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 md:hidden">
            <Image
              src="/transparent_background_logo.png"
              alt="Avulix"
              width={110}
              height={38}
              className="object-contain h-9 w-auto"
              priority
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
            style={{ color: "#9DA3B4" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          <h1 className="text-3xl font-extrabold mb-1" style={{ color: "#1F2533" }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: "#9DA3B4" }}>
            Sign in to your school account
          </p>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#FDECEA", color: "#8C2820" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A5168" }}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9DA3B4" }} />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E2E4EA", backgroundColor: "#F5F6F8" }}
                  placeholder="you@school.co.za"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  autoComplete="email"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1A2340";
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E4EA";
                    e.target.style.backgroundColor = "#F5F6F8";
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A5168" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9DA3B4" }} />
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#E2E4EA", backgroundColor: "#F5F6F8" }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1A2340";
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E2E4EA";
                    e.target.style.backgroundColor = "#F5F6F8";
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                  style={{ color: "#9DA3B4" }}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{ backgroundColor: "#C0392B" }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: "#9DA3B4" }}>
            By signing in you agree to our data privacy policy (POPIA).
          </p>

          {/* Demo hint */}
          <div
            className="mt-4 p-3.5 rounded-xl text-center"
            style={{ backgroundColor: "#F5F6F8" }}
          >
            <p className="text-xs" style={{ color: "#9DA3B4" }}>
              Demo: <span className="font-semibold" style={{ color: "#4A5168" }}>admin@demo.avulix.co.za</span>{" "}
              / <span className="font-semibold" style={{ color: "#4A5168" }}>Demo1234!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
