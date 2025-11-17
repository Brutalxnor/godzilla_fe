// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import { LoginService } from "@/app/auth/services/login.service"; // ⬅️ your service
// import { toast } from "react-toastify";
// import useGetTheme from "@/app/Hooks/useGetTheme";

// export default function LoginForm() {
//   const [showPw, setShowPw] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const res = await LoginService({ email, password });
//       if ("error" in res) {
//         console.log("error :", res);
//         toast.error(res.error as string); // ← toast أحمر للخطأ
//       } else {
//         console.log("Login success:", res);
//         toast.success("Login Successfully!"); // ← toast أخضر للنجاح
//         // Reload الصفحة بعد ثانية (اختياري – أو استخدم router.push('/dashboard'))
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       }
//     } catch (err) {
//       // ← أضف اسم للـ err عشان type safety
//       console.error("Unexpected error:", err); // ← log أفضل
//       setError("Unexpected error");
//       toast.error("Unexpected error occurred"); // ← toast عام
//     } finally {
//       setLoading(false);
//     }
//   }

//   const {theme} = useGetTheme()

//   return (
//     <main className={`min-h-screen  flex items-center justify-center px-4 sm:px-6 ${theme == "dark" ? "bg-black": "bg-[#f7f7f7]"}`}>
//       <div className={`w-full max-w-[520px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[780px] rounded-2xl  ${theme == "dark" ? "bg-[#0f0f10] border border-[#27272a]": "bg-white shadow-sm border border-gray-200"} p-6 md:p-8`}>
//         {/* Logo */}
//         <div className="w-12 h-12 mx-auto rounded-full bg-rose-500 flex items-center justify-center">
//           <svg
//             width="22"
//             height="22"
//             viewBox="0 0 24 24"
//             fill="white"
//             aria-hidden
//           >
//             <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
//           </svg>
//         </div>

//         {/* Heading */}
//         <h1 className="text-center text-2xl sm:text-3xl font-semibold mt-4 sm:mt-5">
//           Welcome to Godzilla
//         </h1>
//         <p className="text-center text-xs sm:text-sm text-gray-500 mt-1">
//           Transform your fitness journey
//         </p>

//         {/* Banner image */}
//         <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
//           <Image
//             src="/godzillaImage.jpeg"
//             alt="Gym dumbbells"
//             width={920}
//             height={480}
//             className="h-64 w-full object-cover"
//             priority
//           />
//         </div>

//         {/* Error (added) */}
//         {error && (
//           <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-10 space-y-10 ">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className={`mt-2 w-full ${theme === "dark" ? "bg-black!": "border border-gray-200 bg-[#f7f7fb]!" } rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400`}
//               required
//               value={email} // ⬅️ bind
//               onChange={(e) => setEmail(e.target.value)}
//               autoComplete="email"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative mt-2">
//               <input
//                 type={showPw ? "text" : "password"} // <-- toggles here
//                 placeholder="Enter your password"
//                 className="w-full rounded-xl border border-gray-200 bg-[#f7f7fb] px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-rose-400"
//                 required
//                 value={password} // ⬅️ bind
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//               />
//               <span
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-base sm:text-lg select-none cursor-pointer"
//                 role="button"
//                 tabIndex={0}
//                 aria-label={showPw ? "Hide password" : "Show password"}
//                 aria-pressed={showPw}
//                 onClick={() => setShowPw((s) => !s)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" || e.key === " ") setShowPw((s) => !s);
//                 }}
//               >
//                 {showPw ? "Hide" : "👁️"}
//               </span>
//             </div>
//           </div>

//           {/* Sign in button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-2 w-full rounded-xl bg-rose-400 text-white font-medium py-3 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
//           >
//             <span>{loading ? "Signing in..." : "Sign In"}</span>
//             <span className="text-xl leading-none">→</span>
//           </button>
//         </form>

//         {/* Footer link */}
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don&apos;t have an account?{" "}
//           <a href="/sign-up" className="text-rose-500 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LoginService } from "@/app/auth/services/login.service";
import { toast } from "react-toastify";
import useGetTheme from "@/app/Hooks/useGetTheme";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { theme } = useGetTheme();

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyD2KSTvxrumY6n29OZx_3D4861PfzyQnEI",
    authDomain: "godzilla-95bf1.firebaseapp.com",
    projectId: "godzilla-95bf1",
    storageBucket: "godzilla-95bf1.firebasestorage.app",
    messagingSenderId: "529422424716",
    appId: "1:529422424716:web:911f1b61f015c4463a79a9",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // toast.success("Login Successfullysdfsdfd!");

        await fetch("http://localhost:4000/api/v1/auth/login-with-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            password: "Gz!@435&Hk90",
          }),
        }).then((res) => {
          return res.json();
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Email/Password Login
  // Email/Password Login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await LoginService({ email, password });
      if ("error" in res) {
        toast.error(res.error as string);
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

  // Google Sign-In with Popup
  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will catch the user → toast shown
    } catch (err: unknown) {
      console.error("Google login error:", err);
      if ((err.code as Er) === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // User closed popup
      } else {
        toast.error("Google sign-in failed. Try again.");
      }
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
                {showPw ? "Hide" : "View"}
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
          Don't have an account?{" "}
          <a href="/sign-up" className="text-rose-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
