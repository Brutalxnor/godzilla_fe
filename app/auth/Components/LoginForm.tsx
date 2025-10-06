"use client";
import Image from "next/image";
import { useState } from "react";
import { LoginService } from "@/app/auth/services/login.service"; // ⬅️ your service
import { toast } from "react-toastify";

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await LoginService({ email, password });
      if ("error" in res) {
        console.log("error :", res);
        toast.error(res.error as string); // ← toast أحمر للخطأ
      } else {
        console.log("Login success:", res);
        toast.success("Login Successfully!"); // ← toast أخضر للنجاح
        // Reload الصفحة بعد ثانية (اختياري – أو استخدم router.push('/dashboard'))
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      // ← أضف اسم للـ err عشان type safety
      console.error("Unexpected error:", err); // ← log أفضل
      setError("Unexpected error");
      toast.error("Unexpected error occurred"); // ← toast عام
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[520px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] rounded-2xl bg-white shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Logo */}
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500 flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden
          >
            <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-center text-2xl sm:text-3xl font-semibold mt-4 sm:mt-5">
          Welcome to Godzilla
        </h1>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
          Transform your fitness journey
        </p>

        {/* Banner image */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          <Image
            src="/godzillaImage.jpeg"
            alt="Gym dumbbells"
            width={920}
            height={480}
            className="h-64 w-full object-cover"
            priority
          />
        </div>

        {/* Error (added) */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-10 ">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-[#f7f7fb] px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400"
              required
              value={email} // ⬅️ bind
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPw ? "text" : "password"} // <-- toggles here
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 bg-[#f7f7fb] px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-rose-400"
                required
                value={password} // ⬅️ bind
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-base sm:text-lg select-none cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={showPw ? "Hide password" : "Show password"}
                aria-pressed={showPw}
                onClick={() => setShowPw((s) => !s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowPw((s) => !s);
                }}
              >
                {showPw ? "Hide" : "👁️"}
              </span>
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-rose-400 text-white font-medium py-3 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <span className="text-xl leading-none">→</span>
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-rose-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
