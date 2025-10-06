// app/page.tsx (or src/app/page.tsx)
import Image from "next/image";

export default function LoginForm() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[380px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[990px] rounded-2xl bg-white shadow-sm border border-gray-200 p-5 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
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
        <div className="mt-5 sm:mt-6 overflow-hidden rounded-xl border border-gray-200">
          <Image
            src="/godzillaImage.jpeg"
            alt="Gym dumbbells"
            width={1200}
            height={600}
            priority
            sizes="(max-width: 640px) 100vw, 560px"
            className="w-full h-36 sm:h-40 md:h-48 lg:h-56 xl:h-64 object-cover"
          />
        </div>

        {/* Form */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-[#f7f7fb] px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 bg-[#f7f7fb] px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-rose-400"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-base sm:text-lg select-none"
                aria-hidden
              >
                👁️
              </span>
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-rose-400 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <span className="text-lg sm:text-xl leading-none">→</span>
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-rose-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
