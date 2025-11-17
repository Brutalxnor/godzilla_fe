// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import {
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   Dumbbell,
//   ShieldCheck,
//   Users,
//   Sparkles,
//   CheckCircle2,
//   Menu,
//   X,
//   Moon,
//   Sun,
// } from "lucide-react";
// import { useEffect, useState, type JSX, type ReactNode } from "react";

// /* ----------------------------- theme helpers (same concept as Genius) ----------------------------- */

// type Theme = "light" | "dark";

// const getInitialTheme = (): Theme => {
//   if (typeof window === "undefined") return "light";
//   const stored = localStorage.getItem("theme");
//   if (stored === "light" || stored === "dark") return stored;

//   return window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// };

// const applyTheme = (theme: Theme) => {
//   if (typeof document === "undefined") return;
//   const root = document.documentElement;

//   root.setAttribute("data-theme", theme); // works with your global CSS like in Genius
//   root.classList.remove("light", "dark");
//   root.classList.add(theme);

//   localStorage.setItem("theme", theme);
// };

// /* ----------------------------- types ----------------------------- */

// type FeatureCard = {
//   id: number;
//   title: string;
//   description: string;
//   icon: ReactNode;
// };

// type Testimonial = {
//   id: number;
//   name: string;
//   role: string;
//   text: string;
//   avatarSrc: string;
// };

// type HighlightStat = {
//   id: number;
//   label: string;
//   value: string;
// };

// /* ----------------------------- data ----------------------------- */

// const featureCards: FeatureCard[] = [
//   {
//     id: 1,
//     title: "Share, Motivate, Inspire.",
//     description:
//       "Follow top coaches and athletes, share your workouts, and stay accountable with a supportive community.",
//     icon: <Users className="h-6 w-6" />,
//   },
//   {
//     id: 2,
//     title: "Professional Training",
//     description:
//       "Access structured programs tailored to your goals, from fat loss to muscle building and performance.",
//     icon: <Dumbbell className="h-6 w-6" />,
//   },
//   {
//     id: 3,
//     title: "Simple, Secure, Seamless",
//     description:
//       "Train, track, and pay all in one platform with secure payments and smooth user experience.",
//     icon: <ShieldCheck className="h-6 w-6" />,
//   },
//   {
//     id: 4,
//     title: "Train. Earn. Achieve.",
//     description:
//       "Turn your passion for fitness into a scalable income stream with online coaching and programs.",
//     icon: <Sparkles className="h-6 w-6" />,
//   },
// ];

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     name: "Ahmed K.",
//     role: "Online Athlete",
//     text: "Within just one week, I started seeing visible results and finally had structure in my training.",
//     avatarSrc: "/images/testimonials/athlete-1.png",
//   },
//   {
//     id: 2,
//     name: "Coach Abdallah",
//     role: "Online Coach",
//     text: "Godzilla helped me turn my offline clients into a global online business in months.",
//     avatarSrc: "/images/testimonials/coach-1.png",
//   },
//   {
//     id: 3,
//     name: "Omar R.",
//     role: "Hybrid Athlete",
//     text: "Tracking my progress and staying accountable became 10x easier with the app.",
//     avatarSrc: "/images/testimonials/athlete-2.png",
//   },
// ];

// const highlightStats: HighlightStat[] = [
//   { id: 1, label: "COACHES", value: "100+" },
//   { id: 2, label: "ATHLETES", value: "5K+" },
//   { id: 3, label: "PROGRAMS", value: "250+" },
// ];

// /* ----------------------------- page ----------------------------- */

// export default function GodzillaLandingPage(): JSX.Element {
//   const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
//   const [navOpen, setNavOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [animate, setAnimate] = useState(false);

//   // 🌗 theme state (same idea as Genius)
//   const [theme, setTheme] = useState<Theme>("light");

//   useEffect(() => {
//     const initial = getInitialTheme();
//     setTheme(initial);
//     applyTheme(initial);
//   }, []);

//   const toggleTheme = () => {
//     setTheme((prev) => {
//       const next = prev === "light" ? "dark" : "light";
//       applyTheme(next);
//       return next;
//     });
//   };

//   useEffect(() => {
//     setAnimate(false);
//     const t = setTimeout(() => setAnimate(true), 20);
//     return () => clearTimeout(t);
//   }, [activeTestimonial]);

//   const currentTestimonial: Testimonial = testimonials[activeTestimonial];

//   const goNext = (): void => {
//     setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
//   };

//   const goPrev = (): void => {
//     setActiveTestimonial((prev) =>
//       prev === 0 ? testimonials.length - 1 : prev - 1
//     );
//   };

//   const setByIndex = (index: number): void => {
//     setActiveTestimonial(index);
//   };

//   // auto-slide (paused on hover)
//   useEffect(() => {
//     if (isHovered) return;

//     const id = setInterval(() => {
//       setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 1000); // adjust speed if you want

//     return () => clearInterval(id);
//   }, [isHovered]);

//   return (
//     <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300 overflow-x-hidden">
//       {/* ----------------------- HERO ----------------------- */}
//       <header className="relative isolate overflow-hidden bg-black/70 min-h-[920px] md:h-[70vh]">
//         {/* background image */}
//         <div className="absolute inset-0 -z-10">
//           <img
//             src="landing.png"
//             alt="Athlete training"
//             className="h-full w-full object-cover object-[50%_80%]"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
//         </div>

//         {/* TOP BAR WRAPPER */}
//         <div className="mx-auto w-full max-w-7xl px-4 pt-4 relative z-30">
//           <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/5 px-4 py-3 backdrop-blur-md">
//             {/* logo */}
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 font-semibold">
//                 GZ
//               </div>
//               <span className="hidden text-[18px] font-semibold text-white/80 sm:inline">
//                 Godzilla
//               </span>
//             </div>

//             {/* desktop links */}
//             <div className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
//               <Link href="#about" className="hover:text-white text-[18px] transition">
//                 About
//               </Link>
//               <Link
//                 href="#features"
//                 className="hover:text-white text-[18px] transition"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="#coaches"
//                 className="hover:text-white text-[18px] transition"
//               >
//                 Coaches
//               </Link>
//               <Link
//                 href="/community"
//                 className="hover:text-white text-[18px] transition"
//               >
//                 Community
//               </Link>
//               <Link
//                 href="#app"
//                 className="hover:text-white text-[18px] transition"
//               >
//                 App
//               </Link>
//             </div>

//             {/* actions + burger */}
//             <div className="flex items-center gap-2">
//               {/* 🌗 DESKTOP THEME TOGGLE */}
//               <button
//                 type="button"
//                 onClick={toggleTheme}
//                 className="hidden lg:inline-flex items-center gap-1 cursor-pointer rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/20"
//               >
//                 {theme === "light" ? (
//                   <>
//                     <Moon className="h-4 w-4" />
//                     <span>Dark</span>
//                   </>
//                 ) : (
//                   <>
//                     <Sun className="h-4 w-4" />
//                     <span>Light</span>
//                   </>
//                 )}
//               </button>

//               <Link
//   href="sign-up"
//   className="hidden rounded-full border border-white/30 cursor-pointer text-[14px] bg-white/10 px-4 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/20 lg:inline-flex"
// >
//   Sign Up
// </Link>

// <Link
//   href="/login"
//   className="rounded-full bg-white px-4 py-1.5 cursor-pointer text-[14px] text-xs font-semibold text-red-500 shadow-sm hover:bg-slate-100"
// >
//   Sign In
// </Link>


//               {/* burger for mobile / tablet */}
//               <button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white lg:hidden"
//                 aria-label="Toggle navigation"
//                 onClick={() => setNavOpen((open) => !open)}
//               >
//                 {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//               </button>
//             </div>
//           </nav>
//         </div>

//         {/* MOBILE OVERLAY MENU */}
//         {navOpen && (
//           <div className="fixed inset-0 z-20 bg-black/70 lg:hidden">
//             <div className="mx-auto mt-20 w-full max-w-7xl px-4">
//               <div className="rounded-2xl border border-white/15 bg-black/90 px-6 py-5 text-white/90 backdrop-blur">
//                 <div className="flex flex-col gap-3 text-[16px]">
//                   <Link
//                     href="#about"
//                     onClick={() => setNavOpen(false)}
//                     className="py-1 hover:text-white"
//                   >
//                     About
//                   </Link>
//                   <Link
//                     href="#features"
//                     onClick={() => setNavOpen(false)}
//                     className="py-1 hover:text-white"
//                   >
//                     Features
//                   </Link>
//                   <Link
//                     href="#coaches"
//                     onClick={() => setNavOpen(false)}
//                     className="py-1 hover:text-white"
//                   >
//                     Coaches
//                   </Link>
//                   <Link
//                     href="/home"
//                     onClick={() => setNavOpen(false)}
//                     className="py-1 hover:text-white"
//                   >
//                     home
//                   </Link>
//                   <Link
//                     href="#app"
//                     onClick={() => setNavOpen(false)}
//                     className="py-1 hover:text-white"
//                   >
//                     App
//                   </Link>

//                   {/* 🌗 MOBILE THEME TOGGLE */}
//                   <hr className="my-3 border-white/15" />

//                   <button
//                     type="button"
//                     onClick={toggleTheme}
//                     className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
//                   >
//                     {theme === "light" ? (
//                       <>
//                         <Moon className="h-4 w-4" />
//                         <span>Dark mode</span>
//                       </>
//                     ) : (
//                       <>
//                         <Sun className="h-4 w-4" />
//                         <span>Light mode</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* HERO CONTENT */}
//         <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-28 text-center">
//           <p className="mb-4 inline-flex items-center rounded-full bg-white/10 px-5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
//             New · All-in-one platform for coaches &amp; athletes
//           </p>

//           <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-tight text-white">
//             Unleash Your Fitness Journey with{" "}
//             <span className="text-red-400">Godzilla</span>
//           </h1>

//           <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
//             A platform built to connect coaches and athletes and give everyone a
//             structured, motivating, and measurable fitness experience from day
//             one.
//           </p>

//           <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//             <button className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-red-600 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/40 hover:bg-red-500">
//               Start Free Trial
//               <ArrowRight className="h-4 w-4" />
//             </button>
//             <button className="rounded-full border cursor-pointer border-white/40 bg-black/30 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/10">
//               Explore Programs
//             </button>
//           </div>

//           <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-[11px] text-white/80 sm:text-xs">
//             {highlightStats.map((stat) => (
//               <div key={stat.id} className="flex flex-col items-center">
//                 <span className="text-sm font-semibold text-white">
//                   {stat.value}
//                 </span>
//                 <span className="tracking-[0.18em]">{stat.label}</span>
//               </div>
//             ))}
//           </div>
//         </section>
//       </header>

//       {/* ----------------------- "WHAT IS" SECTION ----------------------- */}
//       <section
//         id="about"
//         className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-16 sm:py-20 lg:flex-row lg:px-8"
//       >
//         {/* left text */}
//         <div className="flex-1 max-w-xl space-y-5">
//           <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-semibold leading-[1.25] text-slate-900">
//             What is <span className="text-red-500">Godzilla?</span>
//           </h2>

//           <p className="text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-600">
//             Godzilla is a next-generation fitness app that brings together
//             coaches and athletes in one dynamic platform. With Godzilla, you
//             can:
//           </p>

//           <ul className="mt-2 space-y-2 text-base sm:text-lg lg:text-[20px] text-slate-700">
//             <li className="flex items-start gap-2">
//               <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
//               <span>Discover custom training programs for your goals.</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
//               <span>Connect directly with certified coaches.</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
//               <span>
//                 Share your achievements with a supportive fitness community.
//               </span>
//             </li>
//           </ul>

//           <button
//             type="button"
//             className="mt-4 inline-flex items-center cursor-pointer gap-1 text-[14px] font-semibold text-red-500 hover:text-red-600"
//           >
//             <span>See how Godzilla transforms the way you train.</span>
//             <span aria-hidden>→</span>
//           </button>
//         </div>

//         {/* right image */}
//         <div className="flex flex-1 justify-center lg:justify-end">
//           <div className="relative">
//             <img
//               src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
//               alt="Athlete stretching"
//               className="h-auto w-full max-w-[490px] object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.3)] "
//             />
//             <img
//               src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
//               alt=""
//               aria-hidden="true"
//               className="pointer-events-none absolute inset-0 z-0 -translate-x-5 opacity-15 blur-[1px] "
//             />
//           </div>
//         </div>
//       </section>

//       {/* ----------------------- FEATURES GRID ----------------------- */}
//       <section id="features" className="bg-white py-16 sm:py-20">
//         <div className="mx-auto max-w-6xl px-4 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-2xl sm:text-3xl lg:text-[44px] font-semibold leading-tight text-slate-900">
//               Everything You Need to Level Up — All in{" "}
//               <span className="text-red-500">One Place</span>
//             </h2>
//             <p className="mt-3 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-600">
//               Godzilla brings your entire fitness world together. Train,
//               connect, and grow inside one smart platform made for athletes and
//               coaches alike.
//             </p>
//           </div>

//           <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//             {featureCards.map((feature) => (
//               <div
//                 key={feature.id}
//                 className="flex h-full flex-col gap-3 rounded-[24px] bg-white px-7 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
//               >
//                 <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-[15px] font-semibold text-slate-900">
//                   {feature.title}
//                 </h3>
//                 <p className="text-[13px] leading-relaxed text-slate-600">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ----------------------- MID IMAGES STRIP ----------------------- */}
//       <section className="relative w-full bg-[#F7F8FF] py-20 sm:py-28 overflow-hidden">
//         {/* LEFT IMAGE — desktop */}
//         <div className="hidden lg:block absolute left-0 top-0">
//           <img
//             src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
//             className="
//               relative z-10 
//               w-[520px] 
//               -rotate-9 
//               drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
//               object-contain
//             "
//           />

//           <img
//             src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
//             className="
//               absolute top-0 left-6
//               w-[520px]
//               -rotate-6 
//               opacity-20 
//               blur-[2px]
//             "
//             aria-hidden="true"
//           />
//         </div>

//         {/* RIGHT IMAGE — desktop */}
//         <div className="hidden lg:block absolute right-0 top-4">
//           <img
//             src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
//             className="
//               relative z-10 
//               w-[560px] 
//               rotate-7
//               drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
//               object-contain
//             "
//           />

//           <img
//             src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
//             className="
//               absolute top-0 right-6
//               w-[560px]
//               rotate-6
//               opacity-20 
//               blur-[2px]
//             "
//             aria-hidden="true"
//           />
//         </div>

//         {/* CENTER CONTENT */}
//         <div className="relative mx-auto max-w-3xl px-6 text-center">
//           <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-semibold leading-tight text-slate-900">
//             Build <span className="text-red-500">Your Body.</span> Own{" "}
//             <span className="text-red-500">Your Progress.</span>
//           </h2>

//           <p className="mt-6 text-base sm:text-lg lg:text-[20px] text-slate-600 leading-relaxed">
//             Join an active fitness community, find your ideal coach, and start
//             following professional programs tailored to your goals.
//           </p>

//           <ul className="mt-6 space-y-3 text-base sm:text-lg text-slate-700">
//             <li>• Expert programs for every level.</li>
//             <li>• Direct connection with certified coaches.</li>
//             <li>• Track your achievements day by day.</li>
//           </ul>
//         </div>

//         {/* MOBILE IMAGES — side by side on mobile */}
//         <div className="mt-16 flex flex-row items-center justify-center gap-4 lg:hidden">
//           <img
//             src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
//             className="w-[45%] max-w-[180px] object-contain -rotate-6"
//           />

//           <img
//             src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
//             className="w-[45%] max-w-[380px] object-contain rotate-6"
//           />
//         </div>
//       </section>

//       {/* ----------------------- PASSION INTO IMPACT ----------------------- */}
//       <section className="bg-white py-16">
//         <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:gap-16 lg:flex-row lg:items-center lg:px-0">
//           {/* TEXT */}
//           <div className="flex-1 space-y-4 text-center lg:text-left">
//             <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.32em] text-red-500">
//               Turn Your Passion into Impact and Income
//             </h2>

//             <h3 className="text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-snug text-slate-900">
//               Grow your coaching business with built-in tools for scale.
//             </h3>

//             <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-600">
//               Godzilla makes it easy to package your knowledge into programs,
//               onboard new clients, and manage monthly subscriptions — all in one
//               place.
//             </p>

//             <ul className="mt-4 space-y-2 text-sm md:text-[16px] leading-relaxed text-slate-700 text-center lg:text-center">
//               <li>• Offer 1:1, group, or self-paced programs.</li>
//               <li>• Collect payments securely and track subscriptions.</li>
//               <li>• Deliver updates, videos, and resources instantly.</li>
//             </ul>
//           </div>

//           {/* IMAGE */}
//           <div className="flex flex-1 justify-center lg:justify-end w-full">
//             <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
//               <img
//                 src="179f6c24c41c3334a553f4e1898ef4352193bb56.png"
//                 alt="Coaches on Godzilla"
//                 className="w-full h-auto object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ----------------------- TESTIMONIALS ----------------------- */}
//       <section id="coaches" className="bg-[#f4f6ff] py-20 sm:py-24">
//         <div className="mx-auto max-w-6xl px-4 lg:px-0">
//           <div
//             className="relative overflow-hidden rounded-[40px] bg-white px-4 py-10 sm:px-10 sm:py-14 shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             {/* decorative red bars */}
//             <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
//               <div className="flex gap-[3px] text-red-300">
//                 {Array.from({ length: 15 }).map((_, i) => (
//                   <span
//                     key={i}
//                     className="w-[3px] rounded-full bg-[#ff6478]"
//                     style={{
//                       height: 30 + (i <= 7 ? i * 6 : (14 - i) * 6),
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* title */}
//             <h2 className="relative z-10 mb-10 text-center text-2xl sm:text-[32px] font-semibold leading-tight text-slate-900">
//               What Our <span className="text-red-500">Clients Say</span> About Us
//             </h2>

//             {/* slider area */}
//             <div className="relative z-10 flex flex-col items-center gap-8">
//               {/* cards row */}
//               <div className="flex w-full flex-col sm:flex-row items-stretch justify-center gap-6">
//                 {/* left ghost card – desktop only */}
//                 <div className="hidden w-[260px] max-w-[280px] scale-95 rounded-[24px] border border-slate-100 bg-[#f9fbff] px-6 py-6 opacity-50 sm:flex flex-col">
//                   <div className="flex items-center gap-3">
//                     <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200">
//                       <img
//                         src="coach.jpg"
//                         alt={currentTestimonial.name}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[14px] font-semibold text-slate-500">
//                         {currentTestimonial.name}
//                       </span>
//                       <span className="text-[11px] text-slate-500">
//                         {currentTestimonial.role}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-[13px] leading-relaxed text-slate-600">
//                     <span className="mr-1 text-xl text-red-400">“</span>
//                     {currentTestimonial.text}
//                   </div>
//                 </div>

//                 {/* main center card */}
//                 <div
//                   className={`
//                     testimonial-fade 
//                     ${animate ? "active" : ""} 
//                     flex w-full max-w-xl flex-1 flex-col gap-5 rounded-[24px] border border-slate-100 
//                     bg-[#f9fbff] px-5 py-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.10)] 
//                     sm:px-10 sm:py-8
//                   `}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
//                       <img
//                         src="coach.jpg"
//                         alt={currentTestimonial.name}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[15px] font-semibold text-slate-500">
//                         {currentTestimonial.name}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         {currentTestimonial.role}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="relative mt-2 rounded-2xl bg-white px-5 py-6 text-[14px] leading-relaxed text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
//                     <span className="pointer-events-none absolute -top-5 left-4 text-3xl text-red-400">
//                       “
//                     </span>
//                     <p className="pl-4">{currentTestimonial.text}</p>
//                   </div>
//                 </div>

//                 {/* right ghost card – desktop only */}
//                 <div className="hidden w-[260px] max-w-[280px] scale-95 rounded-[24px] border border-slate-100 bg-[#f9fbff] px-6 py-6 opacity-50 sm:flex flex-col">
//                   <div className="flex items-center gap-3">
//                     <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200">
//                       <img
//                         src="coach.jpg"
//                         alt={currentTestimonial.name}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-[14px] font-semibold text-slate-500">
//                         {currentTestimonial.name}
//                       </span>
//                       <span className="text-[11px] text-slate-500">
//                         {currentTestimonial.role}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-[13px] leading-relaxed text-slate-600">
//                     <span className="mr-1 text-xl text-red-400">“</span>
//                     {currentTestimonial.text}
//                   </div>
//                 </div>
//               </div>

//               {/* arrows + dots row */}
//               <div className="mt-2 flex items-center justify-center gap-6">
//                 <button
//                   aria-label="Previous testimonial"
//                   className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
//                   onClick={goPrev}
//                 >
//                   <ChevronLeft className="h-4 w-4 text-red-500" />
//                 </button>

//                 <div className="flex items-center gap-2">
//                   {testimonials.map((testimonial, index) => (
//                     <button
//                       key={testimonial.id}
//                       type="button"
//                       aria-label={`Jump to testimonial ${index + 1}`}
//                       onClick={(): void => setByIndex(index)}
//                       className={`h-2.5 rounded-full transition-all ${
//                         index === activeTestimonial
//                           ? "w-6 bg-red-500"
//                           : "w-2.5 bg-slate-300"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <button
//                   aria-label="Next testimonial"
//                   className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
//                   onClick={goNext}
//                 >
//                   <ChevronRight className="h-4 w-4 text-red-500" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --------------------- GLIMPSE INSIDE GODZILLA ---------------------- */}
//       <section id="app" className="bg-[#f7f8fc] py-16 lg:py-24">
//         <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 lg:flex-row lg:items-center lg:gap-20 lg:px-0">
//           {/* LEFT TEXT */}
//           <div className="flex-1 space-y-6 text-center lg:text-left">
//             <h2 className="text-[18px] font-semibold tracking-wide text-red-500">
//               A Glimpse Inside Godzilla
//             </h2>

//             <h3 className="text-3xl sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-slate-900 lg:max-w-xl">
//               Track every rep, message, and milestone — right in your pocket.
//             </h3>

//             <p className="text-base sm:text-[18px] leading-relaxed text-slate-600 max-w-lg mx-auto lg:mx-0">
//               From workout logs to progress photos and coach messages, the
//               Godzilla app keeps everything organized and ready whenever you
//               are. No spreadsheets, no lost chats, no guesswork.
//             </p>

//             <div className="flex justify-center lg:justify-start">
//               <button className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-[14px] bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 text-[16px] font-semibold text-white shadow-xl hover:opacity-95 transition">
//                 Download App Now
//                 <ArrowRight className="h-5 w-5" />
//               </button>
//             </div>
//           </div>

//           {/* RIGHT PHONES */}
//           <div className="mt-8 flex flex-1 items-center justify-center relative lg:mt-0">
//             <img
//               src="mobleft.png"
//               alt="Godzilla app screen"
//               className="
//                 w-[230px] sm:w-[300px] lg:w-[480px]
//                 rotate-[-10deg]
//                 drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
//                 relative
//                 z-10
//                 -mr-4 sm:mr-10 lg:-mr-50
//               "
//             />

//             <img
//               src="mobright.png"
//               alt="Godzilla app screen"
//               className="
//                 w-[230px] sm:w-[300px] lg:w-[480px]
//                 rotate-[8deg]
//                 drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
//                 relative
//              -ml-4 sm:-ml-1 lg:-ml-30
//               "
//             />
//           </div>
//         </div>
//       </section>

//       {/* ----------------------------- FOOTER ------------------------------ */}
//       <footer className="border-t border-red-200 bg-[#f7f8fc] py-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-[14px] text-slate-500 sm:flex-row">
//           <div className="flex gap-6">
//             <button className="hover:text-slate-700 transition">
//               Terms &amp; Conditions
//             </button>
//             <button className="hover:text-slate-700 transition">Privacy</button>
//           </div>

//           <p className="whitespace-nowrap">
//             © {new Date().getFullYear()} Godzilla. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import {
  useEffect,
  useState,
  type JSX,
  type ReactNode,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";

/* ----------------------------- theme helpers (same concept as Genius) ----------------------------- */

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.setAttribute("data-theme", theme); // works with your global CSS like in Genius
  root.classList.remove("light", "dark");
  root.classList.add(theme);

  localStorage.setItem("theme", theme);
};

/* ----------------------------- types ----------------------------- */

type FeatureCard = {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
};

type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatarSrc: string;
};

type HighlightStat = {
  id: number;
  label: string;
  value: string;
};

/* ----------------------------- data ----------------------------- */

const featureCards: FeatureCard[] = [
  {
    id: 1,
    title: "Share, Motivate, Inspire.",
    description:
      "Follow top coaches and athletes, share your workouts, and stay accountable with a supportive community.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Professional Training",
    description:
      "Access structured programs tailored to your goals, from fat loss to muscle building and performance.",
    icon: <Dumbbell className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Simple, Secure, Seamless",
    description:
      "Train, track, and pay all in one platform with secure payments and smooth user experience.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Train. Earn. Achieve.",
    description:
      "Turn your passion for fitness into a scalable income stream with online coaching and programs.",
    icon: <Sparkles className="h-6 w-6" />,
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed K.",
    role: "Online Athlete",
    text: "Within just one week, I started seeing visible results and finally had structure in my training.",
    avatarSrc: "/images/testimonials/athlete-1.png",
  },
  {
    id: 2,
    name: "Coach Abdallah",
    role: "Online Coach",
    text: "Godzilla helped me turn my offline clients into a global online business in months.",
    avatarSrc: "/images/testimonials/coach-1.png",
  },
  {
    id: 3,
    name: "Omar R.",
    role: "Hybrid Athlete",
    text: "Tracking my progress and staying accountable became 10x easier with the app.",
    avatarSrc: "/images/testimonials/athlete-2.png",
  },
];

const highlightStats: HighlightStat[] = [
  { id: 1, label: "COACHES", value: "100+" },
  { id: 2, label: "ATHLETES", value: "5K+" },
  { id: 3, label: "PROGRAMS", value: "250+" },
];

/* ----------------------------- page ----------------------------- */

export default function GodzillaLandingPage(): JSX.Element {
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
  const [navOpen, setNavOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animate, setAnimate] = useState(false);

  // 🌗 theme state (same idea as Genius)
  const [theme, setTheme] = useState<Theme>("light");

  // ⭐ router + login state
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // ⭐ read login from localStorage once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user"); // adjust key if needed
    setIsLoggedIn(!!token || !!user);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  };

  // ⭐ handle Community click
  const handleCommunityClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isLoggedIn) {
      router.push("/community");
    } else {
      router.push("/login");
    }
  };

  // ⭐ logout handler – stay on landing page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // remove any user data if stored
    setIsLoggedIn(false); // this will swap Logout -> Sign In / Sign Up
    // no navigation here on purpose
  };

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 20);
    return () => clearTimeout(t);
  }, [activeTestimonial]);

  const currentTestimonial: Testimonial = testimonials[activeTestimonial];

  const goNext = (): void => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = (): void => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const setByIndex = (index: number): void => {
    setActiveTestimonial(index);
  };


  // auto-slide (paused on hover)
  useEffect(() => {
    if (isHovered) return;

    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 1000); // adjust speed if you want


    return () => clearInterval(id);
  }, [isHovered]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300 overflow-x-hidden">
      {/* ----------------------- HERO ----------------------- */}
      <header className="relative isolate overflow-hidden bg-black/70 min-h-[920px] md:h-[50vh]">
        {/* background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="landing.png"
            alt="Athlete training"
            className="h-full w-full object-cover object-[50%_80%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/80" />
        </div>

        {/* TOP BAR WRAPPER */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 relative z-30">
          <nav className="flex items-center justify-between rounded-full border border-white/20 bg-white/5 px-4 py-3 backdrop-blur-md">
            {/* logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 font-semibold">
                GZ
              </div>
              <span className="hidden text-[18px] font-semibold text-white/80 sm:inline">
                Godzilla
              </span>
            </div>

            {/* desktop links */}
            <div className="hidden items-center gap-6 text-sm text-white/75 lg:flex">
              <Link
                href="#about"
                className="hover:text-white text-[18px] transition"
              >
                About
              </Link>
              <Link
                href="#features"
                className="hover:text-white text-[18px] transition"
              >
                Features
              </Link>
              <Link
                href="#coaches"
                className="hover:text-white text-[18px] transition"
              >
                Coaches
              </Link>
              <Link
                href={isLoggedIn ? "/community" : "/login"}
                onClick={handleCommunityClick}
                className="hover:text-white text-[18px] transition"
              >
                Community
              </Link>
              <Link
                href="#app"
                className="hover:text-white text-[18px] transition"
              >
                App
              </Link>
            </div>

            {/* actions + burger */}
            <div className="flex items-center gap-2">
              {/* 🌗 DESKTOP THEME TOGGLE */}
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden lg:inline-flex items-center gap-1 cursor-pointer rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/20"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </>
                )}
              </button>

              {/* ⭐ AUTH BUTTONS DEPENDING ON LOGIN STATE */}
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white px-4 py-1.5 cursor-pointer text-[14px] text-xs font-semibold text-red-500 shadow-sm hover:bg-slate-100"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="hidden rounded-full border border-white/30 cursor-pointer text-[14px] bg-white/10 px-4 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur hover:bg-white/20 lg:inline-flex"
                  >
                    Sign Up
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-full bg-white px-4 py-1.5 cursor-pointer text-[14px] text-xs font-semibold text-red-500 shadow-sm hover:bg-slate-100"
                  >
                    Sign In
                  </Link>
                </>
              )}

              {/* burger for mobile / tablet */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-white lg:hidden"
                aria-label="Toggle navigation"
                onClick={() => setNavOpen((open) => !open)}
              >
                {navOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* MOBILE OVERLAY MENU */}
        {navOpen && (
          <div className="fixed inset-0 z-20 bg-black/70 lg:hidden">
            <div className="mx-auto mt-20 w-full max-w-7xl px-4">
              <div className="rounded-2xl border border-white/15 bg-black/90 px-6 py-5 text-white/90 backdrop-blur">
                <div className="flex flex-col gap-3 text-[16px]">
                  <Link
                    href="#about"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    href="#features"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Features
                  </Link>
                  <Link
                    href="#coaches"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    Coaches
                  </Link>
                  <Link
                    href="/home"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    home
                  </Link>
                  <Link
                    href="#app"
                    onClick={() => setNavOpen(false)}
                    className="py-1 hover:text-white"
                  >
                    App
                  </Link>

                  {/* 🌗 MOBILE THEME TOGGLE */}
                  <hr className="my-3 border-white/15" />

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                  >
                    {theme === "light" ? (
                      <>
                        <Moon className="h-4 w-4" />
                        <span>Dark mode</span>
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4" />
                        <span>Light mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HERO CONTENT */}
        <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-28 text-center">
          <p className="mb-4 inline-flex items-center rounded-full bg-white/10 px-5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            New · All-in-one platform for coaches &amp; athletes
          </p>

          <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-tight text-white">
            Unleash Your Fitness Journey with{" "}
            <span className="text-red-400">Godzilla</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
            A platform built to connect coaches and athletes and give everyone a
            structured, motivating, and measurable fitness experience from day
            one.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-red-600 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/40 hover:bg-red-500">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-full border cursor-pointer border-white/40 bg-black/30 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/10">
              Explore Programs
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-[11px] text-white/80 sm:text-xs">
            {highlightStats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center">
                <span className="text-sm font-semibold text-white">
                  {stat.value}
                </span>
                <span className="tracking-[0.18em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </header>

      {/* ----------------------- "WHAT IS" SECTION ----------------------- */}
      <section
        id="about"
        className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-16 sm:py-20 lg:flex-row lg:px-8"
      >
        {/* left text */}
        <div className="flex-1 max-w-xl space-y-5">
          <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-semibold leading-[1.25] text-slate-900">
            What is <span className="text-red-500">Godzilla?</span>
          </h2>

          <p className="text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-600">
            Godzilla is a next-generation fitness app that brings together
            coaches and athletes in one dynamic platform. With Godzilla, you
            can:
          </p>

          <ul className="mt-2 space-y-2 text-base sm:text-lg lg:text-[20px] text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>Discover custom training programs for your goals.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>Connect directly with certified coaches.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-red-500" />
              <span>
                Share your achievements with a supportive fitness community.
              </span>
            </li>
          </ul>

          <button
            type="button"
            className="mt-4 inline-flex items-center cursor-pointer gap-1 text-[14px] font-semibold text-red-500 hover:text-red-600"
          >
            <span>See how Godzilla transforms the way you train.</span>
            <span aria-hidden>→</span>
          </button>
        </div>

        {/* right image */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="relative">
            <img
              src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
              alt="Athlete stretching"
              className="h-auto w-full max-w-[490px] object-contain drop-shadow-[0_30px_60px_rgba(15,23,42,0.3)] "
            />
            <img
              src="4ddde8a8ce300c8eddd6337703cbdbc242df8e3a.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 -translate-x-5 opacity-15 blur-[1px] "
            />
          </div>
        </div>
      </section>
      {/* ----------------------- FEATURES GRID ----------------------- */}
      <section id="features" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[44px] font-semibold leading-tight text-slate-900">
              Everything You Need to Level Up — All in{" "}
              <span className="text-red-500">One Place</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-600">
              Godzilla brings your entire fitness world together. Train,
              connect, and grow inside one smart platform made for athletes and
              coaches alike.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.id}
                className="flex h-full flex-col gap-3 rounded-[24px] bg-white px-7 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  {feature.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ----------------------- MID IMAGES STRIP ----------------------- */}
      <section className="relative w-full bg-[#F7F8FF] py-20 sm:py-28 overflow-hidden">


        {/* LEFT IMAGE — desktop */}
        <div className="hidden lg:block absolute left-0 top-0">
          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="
              relative z-10 
              w-[520px] 
              -rotate-9 
              drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
              object-contain
            "
          />

          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="
              absolute top-0 left-6
              w-[520px]
              -rotate-6 
              opacity-20 
              blur-[2px]
            "
            aria-hidden="true"
          />
        </div>

        {/* RIGHT IMAGE — desktop */}
        <div className="hidden lg:block absolute right-0 top-4">
          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="
              relative z-10 
              w-[560px] 
              rotate-7
              drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)]
              object-contain
            "
          />

          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="
              absolute top-0 right-6
              w-[560px]
              rotate-6
              opacity-20 
              blur-[2px]
            "
            aria-hidden="true"
          />
        </div>

        {/* CENTER CONTENT */}
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-semibold leading-tight text-slate-900">
            Build <span className="text-red-500">Your Body.</span> Own{" "}
            <span className="text-red-500">Your Progress.</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg lg:text-[20px] text-slate-600 leading-relaxed">
            Join an active fitness community, find your ideal coach, and start
            following professional programs tailored to your goals.
          </p>

          <ul className="mt-6 space-y-3 text-base sm:text-lg text-slate-700">
            <li>• Expert programs for every level.</li>
            <li>• Direct connection with certified coaches.</li>
            <li>• Track your achievements day by day.</li>
          </ul>
        </div>

        {/* MOBILE IMAGES — side by side on mobile */}
        <div className="mt-16 flex flex-row items-center justify-center gap-4 lg:hidden">
          <img
            src="8f3cceb6c00884ff29ce68a33ade48666895e1ad.png"
            className="w-[45%] max-w-[180px] object-contain -rotate-6"
          />

          <img
            src="4744ceaa4dac2c594c0d1e586a750b81f8bdb6a1.png"
            className="w-[45%] max-w-[380px] object-contain rotate-6"
          />
        </div>
      </section>
      {/* ----------------------- PASSION INTO IMPACT ----------------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:gap-16 lg:flex-row lg:items-center lg:px-0">
          {/* TEXT */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-[0.32em] text-red-500">
              Turn Your Passion into Impact and Income

=
            </h2>

            <h3 className="text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-snug text-slate-900">
              Grow your coaching business with built-in tools for scale.
            </h3>

            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-600">
              Godzilla makes it easy to package your knowledge into programs,
              onboard new clients, and manage monthly subscriptions — all in one
              place.
            </p>

            <ul className="mt-4 space-y-2 text-sm md:text-[16px] leading-relaxed text-slate-700 text-center lg:text-center">
              <li>• Offer 1:1, group, or self-paced programs.</li>
              <li>• Collect payments securely and track subscriptions.</li>
              <li>• Deliver updates, videos, and resources instantly.</li>
            </ul>
          </div>

          {/* IMAGE */}
          <div className="flex flex-1 justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
              <img
                src="179f6c24c41c3334a553f4e1898ef4352193bb56.png"
                alt="Coaches on Godzilla"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ----------------------- TESTIMONIALS ----------------------- */}
      <section id="testimonials" className="bg-[#f4f6ff] py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-0">
          <div className="relative overflow-hidden rounded-[32px] bg-white px-6 py-10 shadow-[0_32px_80px_rgba(15,23,42,0.12)] sm:px-10 sm:py-12">
            <h2 className="mb-10 text-center text-[24px] font-semibold leading-tight text-slate-900 sm:text-[28px]">
              What Our <span className="text-red-500">Clients Say</span> About
              Us
>>>>>>> Stashed changes
            </h2>

            <h3 className="text-2xl md:text-[32px] lg:text-[36px] font-semibold leading-snug text-slate-900">
              Grow your coaching business with built-in tools for scale.
            </h3>


            <p className="text-sm md:text-base lg:text-lg leading-relaxed text-slate-600">
              Godzilla makes it easy to package your knowledge into programs,
              onboard new clients, and manage monthly subscriptions — all in one
              place.
            </p>

            <ul className="mt-4 space-y-2 text-sm md:text-[16px] leading-relaxed text-slate-700 text-center lg:text-center">
              <li>• Offer 1:1, group, or self-paced programs.</li>
              <li>• Collect payments securely and track subscriptions.</li>
              <li>• Deliver updates, videos, and resources instantly.</li>
            </ul>
          </div>

          {/* IMAGE */}
          <div className="flex flex-1 justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
              <img
                src="179f6c24c41c3334a553f4e1898ef4352193bb56.png"
                alt="Coaches on Godzilla"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>


            <ul className="mt-4 space-y-2 text-sm md:text-[16px] leading-relaxed text-slate-700 text-center lg:text-center">
              <li>• Offer 1:1, group, or self-paced programs.</li>
              <li>• Collect payments securely and track subscriptions.</li>
              <li>• Deliver updates, videos, and resources instantly.</li>
            </ul>
          </div>

          {/* IMAGE */}
          <div className="flex flex-1 justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px]">
              <img
                src="179f6c24c41c3334a553f4e1898ef4352193bb56.png"
                alt="Coaches on Godzilla"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ----------------------- TESTIMONIALS ----------------------- */}
      <section id="coaches" className="bg-[#f4f6ff] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-0">

          <div
            className="relative overflow-hidden rounded-[40px] bg-white px-4 py-10 sm:px-10 sm:py-14 shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* decorative red bars */}
            <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
              <div className="flex gap-[3px] text-red-300">
                {Array.from({ length: 15 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-[#ff6478]"
                    style={{
                      height: 30 + (i <= 7 ? i * 6 : (14 - i) * 6),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* title */}
            <h2 className="relative z-10 mb-10 text-center text-2xl sm:text-[32px] font-semibold leading-tight text-slate-900">
              What Our <span className="text-red-500">Clients Say</span> About Us

            </h2>

            {/* slider area */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* cards row */}
              <div className="flex w-full flex-col sm:flex-row items-stretch justify-center gap-6">
                {/* left ghost card – desktop only */}
                <div className="hidden w-[260px] max-w-[280px] scale-95 rounded-[24px] border border-slate-100 bg-[#f9fbff] px-6 py-6 opacity-50 sm:flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200">
                      <img
                        src="coach.jpg"
                        alt={currentTestimonial.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-slate-500">
                        {currentTestimonial.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {currentTestimonial.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-[13px] leading-relaxed text-slate-600">
                    <span className="mr-1 text-xl text-red-400">“</span>
                    {currentTestimonial.text}
                  </div>
                </div>

                {/* main center card */}
                <div
                  className={`
                    testimonial-fade 
                    ${animate ? "active" : ""} 
                    flex w-full max-w-xl flex-1 flex-col gap-5 rounded-[24px] border border-slate-100 
                    bg-[#f9fbff] px-5 py-6 text-left shadow-[0_18px_40px_rgba(15,23,42,0.10)] 
                    sm:px-10 sm:py-8
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
                      <img
                        src="coach.jpg"
                        alt={currentTestimonial.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-slate-500">
                        {currentTestimonial.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {currentTestimonial.role}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-2 rounded-2xl bg-white px-5 py-6 text-[14px] leading-relaxed text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <span className="pointer-events-none absolute -top-5 left-4 text-3xl text-red-400">
                      “
                    </span>
                    <p className="pl-4">{currentTestimonial.text}</p>
                  </div>
                </div>

                {/* right ghost card – desktop only */}
                <div className="hidden w-[260px] max-w-[280px] scale-95 rounded-[24px] border border-slate-100 bg-[#f9fbff] px-6 py-6 opacity-50 sm:flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200">
                      <img
                        src="coach.jpg"
                        alt={currentTestimonial.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-slate-500">
                        {currentTestimonial.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {currentTestimonial.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-[13px] leading-relaxed text-slate-600">
                    <span className="mr-1 text-xl text-red-400">“</span>
                    {currentTestimonial.text}
                  </div>
                </div>
              </div>

              {/* arrows + dots row */}
              <div className="mt-2 flex items-center justify-center gap-6">
                <button
                  aria-label="Previous testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-4 w-4 text-red-500" />
                </button>

                <div className="flex items-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      aria-label={`Jump to testimonial ${index + 1}`}
                      onClick={(): void => setByIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeTestimonial
                          ? "w-6 bg-red-500"
                          : "w-2.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  aria-label="Next testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                  onClick={goNext}
                >
                  <ChevronRight className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --------------------- GLIMPSE INSIDE GODZILLA ---------------------- */}
      <section id="app" className="bg-[#f7f8fc] py-16 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 lg:flex-row lg:items-center lg:gap-20 lg:px-0">
<<<<<<< Updated upstream

          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-[18px] font-semibold tracking-wide text-red-500">
              A Glimpse Inside Godzilla
            </h2>


            <h3 className="text-3xl sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-slate-900 lg:max-w-xl">
              Track every rep, message, and milestone — right in your pocket.
            </h3>

            <p className="text-base sm:text-[18px] leading-relaxed text-slate-600 max-w-lg mx-auto lg:mx-0">
              From workout logs to progress photos and coach messages, the
              Godzilla app keeps everything organized and ready whenever you
              are. No spreadsheets, no lost chats, no guesswork.
            </p>

            <div className="flex justify-center lg:justify-start">
              <button className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-[14px] bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 text-[16px] font-semibold text-white shadow-xl hover:opacity-95 transition">

                Download App Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>


          <div className="mt-8 flex flex-1 items-center justify-center relative lg:mt-0">
            <img
              src="mobleft.png"
              alt="Godzilla app screen"
              className="

                w-[230px] sm:w-[300px] lg:w-[480px]
                rotate-[-10deg]
                drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
                relative
                z-10
                -mr-4 sm:mr-10 lg:-mr-50
              "

            />

=======
          {/* -------- LEFT TEXT -------- */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-[18px] font-semibold tracking-wide text-red-500">
              A Glimpse Inside Godzilla
            </h2>

            {/* smaller on mobile, same 42px on web (lg) */}
            <h3 className="text-3xl sm:text-[36px] lg:text-[42px] font-bold leading-[1.2] text-slate-900 lg:max-w-xl">
              Track every rep, message, and milestone — right in your pocket.
            </h3>

            <p className="text-base sm:text-[18px] leading-relaxed text-slate-600 max-w-lg mx-auto lg:mx-0">
              From workout logs to progress photos and coach messages, the
              Godzilla app keeps everything organized and ready whenever you
              are. No spreadsheets, no lost chats, no guesswork.
            </p>

            <div className="flex justify-center lg:justify-start">
              <button className="mt-4 inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 text-[16px] font-semibold text-white shadow-xl hover:opacity-95 transition">
                Download App Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* -------- RIGHT PHONES -------- */}
          {/* same look on web, fixed overflow + spacing on mobile */}
          <div className="mt-8 flex flex-1 items-center justify-center relative lg:mt-0">
            <img
              src="mobleft.png"
              alt="Godzilla app screen"
              className="
          w-[230px] sm:w-[300px] lg:w-[480px]
          rotate-[-10deg]
          drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
          relative
          z-10
          -mr-4 sm:mr-5 lg:-mr-50
        "
            />

>>>>>>> Stashed changes
            <img
              src="mobright.png"
              alt="Godzilla app screen"
              className="
<<<<<<< Updated upstream

                w-[230px] sm:w-[300px] lg:w-[480px]
                rotate-[8deg]
                drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
                relative
             -ml-4 sm:-ml-1 lg:-ml-30
              "

=======
          w-[230px] sm:w-[300px] lg:w-[480px]
          rotate-[8deg]
          drop-shadow-[0_40px_70px_rgba(0,0,0,0.25)]
          relative
          -ml-4 sm:-ml-10 lg:-ml-40
        "
>>>>>>> Stashed changes
            />
          </div>
        </div>
      </section>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      {/* ----------------------------- FOOTER ------------------------------ */}
      <footer className="border-t border-red-200 bg-[#f7f8fc] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-[14px] text-slate-500 sm:flex-row">
          <div className="flex gap-6">
            <button className="hover:text-slate-700 transition">
              Terms &amp; Conditions
            </button>
            <button className="hover:text-slate-700 transition">Privacy</button>
          </div>

          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} Godzilla. All rights reserved.
          </p>
        </div>
      </footer>
         
    </div>
  );
}
