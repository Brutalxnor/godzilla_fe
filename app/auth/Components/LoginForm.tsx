"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LoginService } from "@/app/auth/services/login.service";
import { toast } from "react-toastify";
import useGetTheme from "@/app/Hooks/useGetTheme";
import { useRouter } from "next/navigation";

import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseClient";

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { theme } = useGetTheme();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await LoginService({ email, password });
      if ("error" in res) {
        console.log("error :", res);
        toast.error("res.error as string");
      } else {
        console.log("Login success:", res);
        toast.success("Login Successfully!");
        setTimeout(() => {
          router.push("/community");
        }, 1500);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) {
          console.log("No redirect result in this navigation");
          return;
        }

        const user = result.user;

        console.log("Redirect user:", user);

        await fetch("http://localhost:4000/api/v1/auth/login-with-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
          }),
        });

        toast.success("Login with Google successful");
        router.push("/community");
      } catch (err: any) {
        console.error("getRedirectResult error:", err);
        toast.error("Google redirect sign-in failed.");
      }
    };

    handleRedirectResult();
  }, []);

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Popup user:", user);

      const res = await fetch(
        "http://localhost:4000/api/v1/auth/login-with-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Backend login failed");
      }

      toast.success("Login with Google successful");
      setTimeout(() => {
        router.push("/community");
      }, 1500);
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 ${
        theme === "dark" ? "bg-black" : "bg-[#f7f7f7]"
      }`}
    >
      <div
        className={`w-full max-w-[520px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] rounded-2xl p-6 md:p-8 ${
          theme === "dark"
            ? "bg-[#0f0f10] border border-[#27272a]"
            : "bg-white shadow-sm border border-gray-200"
        }`}
      >
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

        <h1
          className={`text-center text-2xl sm:text-3xl font-semibold mt-4 sm:mt-5 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to Godzilla
        </h1>
        <p
          className={`text-center text-xs sm:text-sm mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Transform your fitness journey
        </p>

        <div
          className={`mt-6 overflow-hidden rounded-xl border ${
            theme === "dark" ? "border-[#27272a]" : "border-gray-200"
          }`}
        >
          <Image
            src="/godzillaImage.jpeg"
            alt="Gym dumbbells"
            width={920}
            height={480}
            className="h-64 w-full object-cover"
            priority
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`mt-2 w-full rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 border ${
                theme === "dark"
                  ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                  : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
              }`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-rose-400 border ${
                  theme === "dark"
                    ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
                    : "bg-[#f7f7fb] border-gray-200 text-gray-900 placeholder:text-gray-400"
                }`}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-base sm:text-lg select-none cursor-pointer"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-rose-400 text-white font-medium py-3 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <span className="text-xl leading-none">Right Arrow</span>
          </button>
        </form>

        <button
          onClick={handleLoginWithGoogle}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 6.72c1.63 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p
          className={`text-center text-sm mt-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Do not have an account?{" "}
          <a href="/sign-up" className="text-rose-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
