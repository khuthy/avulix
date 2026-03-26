"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="w-full max-w-md mx-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header banner */}
        <div className="px-5 pt-7 pb-5 sm:px-8 sm:pt-8 sm:pb-6 text-center" style={{ backgroundColor: "#1A2340" }}>
          <div className="flex items-center justify-center mb-2">
            <Image src="/transparent_background_logo.png" alt="Avulix" width={180} height={80} className="object-contain" priority />
          </div>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Powered by Danho Systems</p>
        </div>

        {/* Form */}
        <div className="px-5 py-6 sm:px-8 sm:py-7">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your school account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#FDECEA", color: "#8C2820" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="you@school.co.za"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
            By signing in, you agree to our data privacy policy (POPIA).{" "}
            <br />
            Avulix processes personal information in accordance with Act 4 of 2013.
          </p>
        </div>
      </div>

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs text-white/60">
          Demo: <span className="text-white/80 font-medium">admin@demo.avulix.co.za</span> / <span className="text-white/80 font-medium">Demo1234!</span>
        </p>
      </div>
    </div>
  );
}
