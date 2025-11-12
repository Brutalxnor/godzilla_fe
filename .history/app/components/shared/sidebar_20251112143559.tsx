// // components/shared/Sidebar.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { IconType } from "react-icons";
// import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
// import { FiUsers, FiMessageSquare } from "react-icons/fi";
// import { MdOutlineFitnessCenter } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { IoLogOutOutline } from "react-icons/io5";
// import { LogoutService } from "@/app/auth/services/logout.service";
// import useGetTheme from "@/app/Hooks/useGetTheme";

// type Item = {
//   href: string;
//   label: string;
//   Icon: IconType;
// };

// const items: Item[] = [
//   { href: "/", label: "Home", Icon: AiOutlineHome },
//   { href: "/community", label: "Community", Icon: FiUsers },
//   { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
//   { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
//   { href: "/chat", label: "Chat", Icon: FiMessageSquare },
//   { href: "/profile", label: "Profile", Icon: CgProfile },
// ];

// // locale-safe path strip
// const stripLocale = (p?: string) => {
//   if (!p) return "/";
//   const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
//   return m ? p.slice(m[0].length) || "/" : p;
// };

// export default function Sidebar() {
//   const pathnameRaw = usePathname();
//   const pathname = stripLocale(pathnameRaw);

//   const isActive = (href: string) =>
//     href === "/" ? pathname === "/" : pathname?.startsWith(href);

//   const onLogout = async () => {
//     await LogoutService(); // handles clearing + redirect + reload
//   };

//   const {theme} = useGetTheme()

//   return (
//     <>
//       {/* Hover-to-expand LEFT SIDEBAR (>= lg) */}
//       <aside
//         className="
//           group fixed left-0 top-0 z-40 hidden h-screen
//           w-[88px] hover:w-[260px]
//           overflow-hidden border-r border-gray-200
//           transition-[width] duration-300 lg:flex bg-white
//         "
//       >
//         <div className="flex h-full w-full flex-col px-2 py-5">
//           {/* Brand */}
//           <div className="flex items-center gap-5 px-2 py-10">
//             <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
//               GZ
//             </div>
//             <span
//               className="
//                 text-base font-semibold text-gray-800
//                 opacity-0 transition-all duration-200
//                 group-hover:opacity-100
//               "
//             >
//               Godzilla
//             </span>
//           </div>

//           {/* Nav */}
//           <nav className="flex flex-1 flex-col gap-1 px-2">
//             {items.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={[
//                     `relative  flex items-center gap-3 rounded-xl px-3 py-5`,
//                     "transition-colors",
//                     active
//                       ? "bg-rose-500/5 text-rose-500"
//                       : "text-gray-600 hover:bg-red-50",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
//                       active ? "bg-rose-400" : "bg-transparent",
//                     ].join(" ")}
//                   />
//                   <Icon
//                     className={[
//                       "text-[30px] shrink-0",
//                       active ? "text-rose-400" : "text-gray-600",
//                     ].join(" ")}
//                   />
//                   <span
//                     className="
//                       ml-5 text-[14px] text-black
//                       max-w-0 overflow-hidden opacity-0
//                       transition-all duration-200
//                       group-hover:max-w-[160px] group-hover:opacity-100 font-extrabold
//                     "
//                   >
//                     {label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout pinned at bottom */}
//           <div className="mt-auto px-2 pb-2">
//             <button
//               onClick={onLogout}
//               className="
//                 relative flex w-full items-center gap-3 rounded-xl px-3 py-5
//                 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-[25px] shrink-0" />
//               <span
//                 className="
//                   ml-5 text-[14px] text-gray-800
//                   max-w-0 overflow-hidden opacity-0
//                   transition-all duration-200
//                   group-hover:max-w-[160px] group-hover:opacity-100
//                 "
//               >
//                 Logout
//               </span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Bottom tab bar (< lg) with Logout item */}
//       <nav
//         className="
//           lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white
//           border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
//           pb-[max(env(safe-area-inset-bottom),0px)]
//         "
//       >
//         <ul className="grid grid-cols-7">
//           {items.map(({ href, label, Icon }) => {
//             const active = isActive(href);
//             return (
//               <li key={href} className="flex">
//                 <Link
//                   href={href}
//                   className={[
//                     "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
//                     active
//                       ? "text-rose-600 bg-rose-100"
//                       : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <Icon className="text-xl" />
//                   <span className="text-[11px] font-medium">{label}</span>
//                 </Link>
//               </li>
//             );
//           })}

//           {/* Logout (mobile) */}
//           <li className="flex">
//             <button
//               onClick={onLogout}
//               className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-xl" />
//               <span className="text-[11px] font-medium">Logout</span>
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { IconType } from "react-icons";
// import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
// import { FiUsers, FiMessageSquare } from "react-icons/fi";
// import { MdOutlineFitnessCenter } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { IoLogOutOutline } from "react-icons/io5";
// import { LogoutService } from "@/app/auth/services/logout.service";
// import useGetTheme from "@/app/Hooks/useGetTheme";

// type Item = { href: string; label: string; Icon: IconType };

// const items: Item[] = [
//   { href: "/", label: "Home", Icon: AiOutlineHome },
//   { href: "/community", label: "Community", Icon: FiUsers },
//   { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
//   { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
//   { href: "/chat", label: "Chat", Icon: FiMessageSquare },
//   { href: "/profile", label: "Profile", Icon: CgProfile },
// ];

// const stripLocale = (p?: string) => {
//   if (!p) return "/";
//   const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
//   return m ? p.slice(m[0].length) || "/" : p;
// };

// export default function Sidebar() {
//   const pathnameRaw = usePathname();
//   const pathname = stripLocale(pathnameRaw);
//   const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
//   const onLogout = async () => { await LogoutService(); };
//   const { theme } = useGetTheme();

//   return (
//     <>
//       {/* LEFT SIDEBAR (>= lg) */}
//       <aside
//         className="
//           sidebar  /* marker */
//           group fixed left-0 top-0 z-40 hidden h-screen
//           w-[88px] hover:w-[260px]
//           overflow-hidden border-r border-gray-200
//           transition-[width] duration-300 lg:flex bg-white
//         "
//       >
//         <div className="flex h-full w-full flex-col px-2 py-5">
//           {/* Brand */}
//           <div className="flex items-center gap-5 px-2 py-10">
//             <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
//               GZ
//             </div>
//             <span
//               className="
//                 text-base font-semibold text-gray-800
//                 opacity-0 transition-all duration-200
//                 group-hover:opacity-100
//               "
//             >
//               Godzilla
//             </span>
//           </div>

//           {/* Nav */}
//           <nav className="flex flex-1 flex-col gap-1 px-2">
//             {items.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={[
//                     "group/link",
//                     "relative flex items-center gap-3 rounded-xl px-3 py-5 transition-colors",
//                     active
//                       ? "bg-rose-500/5 text-rose-500"
//                       : "text-gray-600 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
//                       active ? "bg-rose-400" : "bg-transparent",
//                     ].join(" ")}
//                   />
//                   <Icon
//                     className={[
//                       "text-[30px] shrink-0",
//                       active ? "text-rose-400" : "text-gray-600",
//                       "group-hover/link:text-rose-600",
//                     ].join(" ")}
//                   />
//                   <span
//                     className="
//                       ml-5 text-[14px] font-extrabold text-inherit
//                       max-w-0 overflow-hidden opacity-0
//                       transition-all duration-200
//                       group-hover:max-w-[160px] group-hover:opacity-100
//                     "
//                   >
//                     {label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout pinned at bottom */}
//           {/* <div className="mt-auto px-2 pb-2">
//             <button
//               onClick={onLogout}
//               className="
//                 group/link
//                 relative flex w-full items-center gap-3 rounded-xl px-3 py-5
//                 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-[25px] shrink-0 group-hover/link:text-rose-600" />
//               <span
//                 className="
//                   ml-5 text-[14px] text-inherit
//                   max-w-0 overflow-hidden opacity-0
//                   transition-all duration-200
//                   group-hover:max-w-[160px] group-hover:opacity-100
//                 "
//               >
//                 Logout
//               </span>
//             </button>
//           </div> */}
//         </div>
//       </aside>

//       {/* Bottom tab bar (< lg) */}
//       <nav
//         className="
//           sidebar-btm
//           lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white
//           border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
//           pb-[max(env(safe-area-inset-bottom),0px)]
//         "
//       >
//         <ul className="flex justify-between w-full mx-3">
//           {items.map(({ href, label, Icon }) => {
//             const active = isActive(href);
//             return (
//               <li key={href} className="flex">
//                 <Link
//                   href={href}
//                   className={[
//                     "group/link",
//                     "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
//                     active
//                       ? "text-rose-600 bg-rose-100"
//                       : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <Icon className="text-xl group-hover/link:text-rose-600" />
//                   <span className="text-[11px] font-medium text-inherit">{label}</span>
//                 </Link>
//               </li>
//             );
//           })}

//           {/* Logout (mobile) */}
//           {/* <li className="flex">
//             <button
//               onClick={onLogout}
//               className="
//                 group/link
//                 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2
//                 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-xl group-hover/link:text-rose-600" />
//               <span className="text-[11px] font-medium text-inherit">Logout</span>
//             </button>
//           </li> */}
//         </ul>
//       </nav>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation"; // ⬅️ added Params
// import { IconType } from "react-icons";
// import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
// import { FiUsers, FiMessageSquare } from "react-icons/fi";
// import { MdOutlineFitnessCenter } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { IoLogOutOutline } from "react-icons/io5";
// import { LogoutService } from "@/app/auth/services/logout.service";
// import useGetTheme from "@/app/Hooks/useGetTheme";
// import { Suspense } from "react";

// type Item = { href: string; label: string; Icon: IconType };

// const items: Item[] = [
//   { href: "/", label: "Home", Icon: AiOutlineHome },
//   { href: "/community", label: "Community", Icon: FiUsers },
//   { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
//   { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
//   { href: "/chat", label: "Chat", Icon: FiMessageSquare },
//   { href: "/profile", label: "Profile", Icon: CgProfile },
// ];

// const stripLocale = (p?: string) => {
//   if (!p) return "/";
//   const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
//   return m ? p.slice(m[0].length) || "/" : p;
// };

// export default function Sidebar() {
//   const pathnameRaw = usePathname();
//   const pathname = stripLocale(pathnameRaw);

//   const search = useSearchParams();                         // ⬅️ added
//   const hasForeignUser = Boolean(search.get("user_id"));    // ⬅️ added

//   // ⬅️ modified: when viewing /profile?user_id=..., do NOT mark Profile as active
//   const isActive = (href: string) => {
//     if (href === "/profile" && hasForeignUser) return false;
//     return href === "/" ? pathname === "/" : pathname?.startsWith(href);
//   };

//   const onLogout = async () => {
//     await LogoutService();
//   };

// // =======
// //   const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));
// //   const onLogout = async () => { await LogoutService(); };
// // >>>>>>> Stashed changes
//   const { theme } = useGetTheme();

//   return (
//     <>
//       {/* LEFT SIDEBAR (>= lg) */}

//       <aside
//         className="
//           sidebar  /* marker */
//           group fixed left-0 top-0 z-40 hidden h-screen
//           w-[88px] hover:w-[260px]
//           overflow-hidden border-r border-gray-200
//           transition-[width] duration-300 lg:flex bg-white
//         "
//       >
//         <div className="flex h-full w-full flex-col px-2 py-5">
//           {/* Brand */}
//           <div className="flex items-center gap-5 px-2 py-10">
//             <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
//               GZ
//             </div>
//             <span
//               className="
//                 text-base font-semibold text-gray-800
//                 opacity-0 transition-all duration-200
//                 group-hover:opacity-100
//               "
//             >
//               Godzilla
//             </span>
//           </div>

//           {/* Nav */}
//           <nav className="flex flex-1 flex-col gap-1 px-2">
//             {items.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={[
//                     "group/link",
//                     "relative flex items-center gap-3 rounded-xl px-3 py-5 transition-colors",
//                     active
//                       ? "bg-rose-500/5 text-rose-500"
//                       : "text-gray-600 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
//                       active ? "bg-rose-400" : "bg-transparent",
//                     ].join(" ")}
//                   />
//                   <Icon
//                     className={[
//                       "text-[30px] shrink-0",
//                       active ? "text-rose-400" : "text-gray-600",
//                       "group-hover/link:text-rose-600",
//                     ].join(" ")}
//                   />
//                   <span
//                     className="
//                       ml-5 text-[14px] font-extrabold text-inherit
//                       max-w-0 overflow-hidden opacity-0
//                       transition-all duration-200
//                       group-hover:max-w-[160px] group-hover:opacity-100
//                     "
//                   >
//                     {label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* Logout pinned at bottom */}
//           {/* <div className="mt-auto px-2 pb-2">
//             <button
//               onClick={onLogout}
//               className="
//                 group/link
//                 relative flex w-full items-center gap-3 rounded-xl px-3 py-5
//                 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-[25px] shrink-0 group-hover/link:text-rose-600" />
//               <span
//                 className="
//                   ml-5 text-[14px] text-inherit
//                   max-w-0 overflow-hidden opacity-0
//                   transition-all duration-200
//                   group-hover:max-w-[160px] group-hover:opacity-100
//                 "
//               >
//                 Logout
//               </span>
//             </button>
//           </div> */}
//         </div>
//       </aside>

//       {/* Bottom tab bar (< lg) */}
//       <nav
//         className="
//           sidebar-btm

//           lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white
//           border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
//           pb-[max(env(safe-area-inset-bottom),0px)]
//         "
//       >
//         <ul className="flex justify-between w-full mx-3">
//           {items.map(({ href, label, Icon }) => {
//             const active = isActive(href);
//             return (
//               <li key={href} className="flex">
//                 <Link
//                   href={href}
//                   className={[
//                     "group/link",
//                     "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
//                     active
//                       ? "text-rose-600 bg-rose-100"
//                       : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <Icon className="text-xl group-hover/link:text-rose-600" />
//                   <span className="text-[11px] font-medium text-inherit">{label}</span>
//                 </Link>
//               </li>
//             );
//           })}

//           {/* Logout (mobile) */}
//           {/* <li className="flex">
//             <button
//               onClick={onLogout}
//               className="
//                 group/link
//                 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2
//                 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-xl group-hover/link:text-rose-600" />
//               <span className="text-[11px] font-medium text-inherit">Logout</span>
//             </button>
//           </li> */}
//         </ul>
//       </nav>

//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import { IconType } from "react-icons";
// import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
// import { FiUsers, FiMessageSquare } from "react-icons/fi";
// import { MdOutlineFitnessCenter } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { IoLogOutOutline } from "react-icons/io5";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { LogoutService } from "@/app/auth/services/logout.service";
// import useGetTheme from "@/app/Hooks/useGetTheme";
// import { useState, useEffect, Suspense } from "react";

// type Item = { href: string; label: string; Icon: IconType };

// const items: Item[] = [
//   { href: "/", label: "Home", Icon: AiOutlineHome },
//   { href: "/community", label: "Community", Icon: FiUsers },
//   { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
//   { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
//   { href: "/chat", label: "Chat", Icon: FiMessageSquare },
//   { href: "/profile", label: "Profile", Icon: CgProfile },

// ];

// const stripLocale = (p?: string) => {
//   if (!p) return "/";
//   const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
//   return m ? p.slice(m[0].length) || "/" : p;
// };

// export default function Sidebar() {
//   const pathnameRaw = usePathname();
//   const pathname = stripLocale(pathnameRaw);
//   const search = useSearchParams();
//   const hasForeignUser = Boolean(search.get("user_id"));

//   const isActive = (href: string) => {
//     if (href === "/profile" && hasForeignUser) return false;
//     return href === "/" ? pathname === "/" : pathname?.startsWith(href);
//   };

//   const onLogout = async () => {
//     await LogoutService();
//   };

//   const { theme } = useGetTheme();

//   // ===== mobile burger state =====
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // close burger when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [pathname]);

//   // show ONLY 3 primary tabs in bottom bar
//   const mobilePrimaryHrefs = ["/", "/community", "/programs"]; // Home, Community, Programs
//   const mobilePrimaryItems = items.filter((i) =>
//     mobilePrimaryHrefs.includes(i.href)
//   );
//   const mobileSecondaryItems = items.filter(
//     (i) => !mobilePrimaryHrefs.includes(i.href)
//   );

//   return (
//     <>
//       {/* LEFT SIDEBAR (>= lg) – unchanged from your original */}
//       <aside
//         className="
//           sidebar  /* marker */
//           group fixed left-0 top-0 z-40 hidden h-screen
//           w-[88px] hover:w-[260px]
//           overflow-hidden border-r border-gray-200
//           transition-[width] duration-300 lg:flex bg-white
//         "
//       >
//         <div className="flex h-full w-full flex-col px-2 py-5">
//           {/* Brand */}
//           <div className="flex items-center gap-5 px-2 py-10">
//             <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
//               GZ
//             </div>
//             <span
//               className="
//                 text-base font-semibold text-gray-800
//                 opacity-0 transition-all duration-200
//                 group-hover:opacity-100
//               "
//             >
//               Godzilla
//             </span>
//           </div>

//           {/* Nav */}
//           <nav className="flex flex-1 flex-col gap-1 px-2">
//             {items.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={[
//                     "group/link",
//                     "relative flex items-center gap-3 rounded-xl px-3 py-5 transition-colors",
//                     active
//                       ? "bg-rose-500/5 text-rose-500"
//                       : "text-gray-600 hover:bg-rose-50 hover:text-rose-600",
//                   ].join(" ")}
//                 >
//                   <span
//                     className={[
//                       "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
//                       active ? "bg-rose-400" : "bg-transparent",
//                     ].join(" ")}
//                   />
//                   <Icon
//                     className={[
//                       "text-[30px] shrink-0",
//                       active ? "text-rose-400" : "text-gray-600",
//                       "group-hover/link:text-rose-600",
//                     ].join(" ")}
//                   />
//                   <span
//                     className="
//                       ml-5 text-[14px] font-extrabold text-inherit
//                       max-w-0 overflow-hidden opacity-0
//                       transition-all duration-200
//                       group-hover:max-w-[160px] group-hover:opacity-100
//                     "
//                   >
//                     {label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* (Optional) desktop logout at bottom – still commented as in your code */}
//           {/* <div className="mt-auto px-2 pb-2">
//             <button
//               onClick={onLogout}
//               className="
//                 group/link
//                 relative flex w-full items-center gap-3 rounded-xl px-3 py-5
//                 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors
//               "
//               aria-label="Logout"
//             >
//               <IoLogOutOutline className="text-[25px] shrink-0 group-hover/link:text-rose-600" />
//               <span
//                 className="
//                   ml-5 text-[14px] text-inherit
//                   max-w-0 overflow-hidden opacity-0
//                   transition-all duration-200
//                   group-hover:max-w-[160px] group-hover:opacity-100
//                 "
//               >
//                 Logout
//               </span>
//             </button>
//           </div> */}
//         </div>
//       </aside>

//       {/* MOBILE BOTTOM NAV (<= lg) – with 3 tabs + burger */}
//       <nav
//         className="
//           sidebar-btm
//           lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white
//           border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
//           pb-[max(env(safe-area-inset-bottom),0px)]
//         "
//       >
//         <div className="relative flex items-center justify-between px-2">
//           {/* primary tabs (max 3) */}
//           <ul className="flex flex-1 justify-evenly mr-2">
//             {mobilePrimaryItems.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <li key={href} className="flex min-w-[64px]">
//                   <Link
//                     href={href}
//                     className={[
//                       "group/link",
//                       "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
//                       active
//                         ? "text-rose-600 bg-rose-100"
//                         : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
//                     ].join(" ")}
//                   >
//                     <Icon className="text-xl group-hover/link:text-rose-600" />
//                     <span className="text-[11px] font-medium text-inherit">
//                       {label}
//                     </span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>

//           {/* burger button */}
//           <div className="relative flex items-center">
//             <button
//               onClick={() => setMobileMenuOpen((v) => !v)}
//               className="
//                 flex h-10 w-10 items-center justify-center rounded-full
//                 bg-rose-500 text-white shadow-md
//                 hover:bg-rose-600 active:scale-95 transition
//               "
//               aria-label="Open menu"
//             >
//               <RxHamburgerMenu className="text-xl" />
//             </button>

//             {mobileMenuOpen && (
//               <div
//                 className="
//                   absolute right-0 bottom-12 mb-2
//                   w-56 rounded-2xl border border-gray-200 bg-white
//                   shadow-lg shadow-black/10 overflow-hidden
//                 "
//               >
//                 {/* secondary nav items (rest of the tabs, including Profile) */}
//                 {mobileSecondaryItems.map(({ href, label, Icon }) => (
//                   <Link
//                     key={href}
//                     href={href}
//                     className="
//                       flex items-center gap-2 px-4 py-3 text-sm
//                       text-gray-700 hover:bg-rose-50 hover:text-rose-600
//                     "
//                   >
//                     <Icon className="text-lg" />
//                     <span>{label}</span>
//                   </Link>
//                 ))}

//                 {/* Divider */}
//                 <div className="h-px bg-gray-100 my-1" />

//                 {/* Logout */}
//                 <Link
//   href="/"
//   onClick={async (e) => {
//     e.preventDefault();
//     await onLogout();
//     window.location.href = "/";
//   }}
//   className="
//     flex w-full items-center gap-2 px-4 py-3 text-sm
//     text-gray-700 hover:bg-rose-50 hover:text-rose-600
//   "
// >
//   <IoLogOutOutline className="text-lg" />
//   <span>Logout</span>
// </Link>

//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
import { FiUsers, FiMessageSquare } from "react-icons/fi";
import { MdOutlineFitnessCenter } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { LogoutService } from "@/app/auth/services/logout.service";
import useGetTheme from "@/app/Hooks/useGetTheme";
import useGetUser from "@/app/Hooks/useGetUser";
import ThemeToggle from "@/app/components/ThemeToggle";
import { useState, useEffect } from "react";

type Item = { href: string; label: string; Icon: IconType };

// 🔹 All possible nav items
const items: Item[] = [
  { href: "/", label: "Home", Icon: AiOutlineHome },
  { href: "/community", label: "Community", Icon: FiUsers },
  { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
  { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
  { href: "/chat", label: "Chat", Icon: FiMessageSquare },
];

const stripLocale = (p?: string) => {
  if (!p) return "/";
  const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
  return m ? p.slice(m[0].length) || "/" : p;
};

export default function Sidebar() {
  const pathnameRaw = usePathname();
  const pathname = stripLocale(pathnameRaw);
  const search = useSearchParams();
  const hasForeignUser = Boolean(search.get("user_id"));

  const isActive = (href: string) => {
    if (href === "/profile" && hasForeignUser) return false;
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  };

  const onLogout = async () => {
    await LogoutService();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("avatar_url");
    window.location.href = "/";
  };

  const { theme } = useGetTheme();
  const { userDB } = useGetUser();

  // ===== typed Godzilla user shape (for name + email) =====
  type SidebarUserDB = {
    data?: {
      user?: {
        first_name?: string;
        second_name?: string;
        user_type?: "athlete" | "coach" | string; // 👈 role here
        avatar_url?: string;
      };
      email?: string;
      user_type?: "athlete" | "coach" | string; // just in case it’s on root
    };
  };

  const typedUser = (userDB as SidebarUserDB | undefined)?.data;
  const user = typedUser?.user;
  const email = typedUser?.email ?? "";

  // 👇 determine role from userDB
  const userType = user?.user_type ?? typedUser?.user_type ?? undefined; // "athlete" | "coach" | undefined

  // 👇 final items shown in sidebar:
  // if coach ➜ hide /trainers
  const sidebarItems: Item[] =
    userType === "coach" ? items.filter((i) => i.href !== "/trainers") : items;

  const displayName = (() => {
    const raw =
      `${user?.first_name ?? ""} ${user?.second_name ?? ""}`.trim() ||
      (email ? email.split("@")[0] : "") ||
      "User";
    return raw
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  })();

  const initialLetter = displayName.charAt(0).toUpperCase() || "G";

  const Image = user?.avatar_url;

  // ===== mobile burger state =====
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const mobilePrimaryHrefs = ["/", "/community", "/programs"];

  // 👇 use sidebarItems instead of items so /trainers is also hidden on mobile
  const mobilePrimaryItems = sidebarItems.filter((i) =>
    mobilePrimaryHrefs.includes(i.href)
  );
  const mobileSecondaryItems = sidebarItems.filter(
    (i) => !mobilePrimaryHrefs.includes(i.href)
  );

  return (
    <>
      {/* ============ DESKTOP SIDEBAR (>= lg) ============ */}
      <aside
        className="
          sidebar
          group fixed left-0 top-0 z-40 hidden h-screen
          w-[88px] hover:w-[260px]
          overflow-hidden border-r border-gray-200 
          transition-[width] duration-300 lg:flex
          bg-white dark:bg-zinc-900
        "
      >
        <div className="flex h-full w-full flex-col px-2 py-5">
          {/* Brand */}
          <div className="flex items-center gap-5 px-2 py-10">
            <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
              GZ
            </div>
            <span
              className="
                text-base font-semibold text-gray-800 dark:text-zinc-100
                opacity-0 transition-all duration-200
                group-hover:opacity-100
              "
            >
              Godzilla
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col gap-1 px-2">
            {sidebarItems.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "group/link",
                    "relative flex items-center gap-3 rounded-xl px-3 py-5 transition-colors",
                    active
                      ? "bg-rose-500/5 text-rose-500"
                      : "text-gray-600 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
                      active ? "bg-rose-400" : "bg-transparent",
                    ].join(" ")}
                  />
                  <Icon
                    className={[
                      "text-[30px] shrink-0",
                      active
                        ? "text-rose-400"
                        : "text-gray-600 dark:text-zinc-300",
                      "group-hover/link:text-rose-600",
                    ].join(" ")}
                  />
                  <span
                    className="
                      ml-5 text-[14px] font-extrabold text-inherit
                      max-w-0 overflow-hidden opacity-0
                      transition-all duration-200
                      group-hover:max-w-[160px] group-hover:opacity-100
                    "
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ===== footer: theme + profile + logout (unchanged) ===== */}
          <div className="mt-auto px-2 pb-3 pt-3 border-t border-gray-200 dark:border-zinc-700 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 mb-3">
              <ThemeToggle />
            </div>

            {typedUser && (
              <div className="mb-0 flex px-1 items-center gap-3">
                <div className="flex  h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 font-semibold">
                  {Image ? (
                    <img
                      src={data.avatar_url}
                      alt={data.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    { initialLetter }
                  )}
                </div>
                <div className="hidden group-hover:block max-w-[160px]">
                  <p className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-100">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
                    {email}
                  </p>
                </div>
              </div>
            )}

            <Link
              href="/profile"
              className={[
                "group/link",
                "flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors",
                isActive("/profile")
                  ? "bg-rose-500/5 text-rose-500"
                  : "text-gray-600 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600",
              ].join(" ")}
            >
              <div className="flex gap-3 items-center">
                <CgProfile
                  className={[
                    "text-[28px] shrink-0",
                    isActive("/profile")
                      ? "text-rose-400"
                      : "text-gray-600 dark:text-zinc-300",
                    "group-hover/link:text-rose-600",
                  ].join(" ")}
                />
                <span
                  className="
                    hidden group-hover:inline
                    text-[14px] font-semibold
                  "
                >
                  Profile
                </span>
              </div>
            </Link>

            <button
              onClick={onLogout}
              className="
                group/link
                flex items-center justify-between rounded-xl px-3 py-3 text-sm
                text-gray-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600
                transition-colors
              "
            >
              <div className="flex gap-3 px-1 items-center">
                <IoLogOutOutline
                  className="
                    text-[28px] text-red-600 shrink-0
                    group-hover/link:text-red-600
                  "
                />
                <span
                  className="
                    hidden group-hover:inline
                    text-[14px] font-semibold text-red-600
                  "
                >
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MOBILE BOTTOM NAV (<= lg) ============ */}
      <nav
        className="
          sidebar-btm 
          lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-zinc-900
          border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
          pb-[max(env(safe-area-inset-bottom),0px)]
        "
      >
        <div className="relative flex items-center justify-between px-2">
          {/* primary tabs */}
          <ul className="flex flex-1 justify-evenly mr-2">
            {mobilePrimaryItems.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} className="flex min-w-[64px]">
                  <Link
                    href={href}
                    className={[
                      "group/link",
                      "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
                      active
                        ? "text-rose-600 bg-rose-100"
                        : "text-gray-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600",
                    ].join(" ")}
                  >
                    <Icon className="text-xl group-hover/link:text-rose-600" />
                    <span className="text-[11px] font-medium text-inherit">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* burger */}
          <div className="relative flex items-center">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="
                flex h-10 w-10 items-center justify-center rounded-full
                bg-rose-500 text-white shadow-md
                hover:bg-rose-600 active:scale-95 transition
              "
              aria-label="Open menu"
            >
              <RxHamburgerMenu className="text-xl" />
            </button>

            {mobileMenuOpen && (
              <div
                className="
                  absolute right-0 bottom-12 mb-2
                  w-56 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900
                  shadow-lg shadow-black/10 overflow-hidden
                "
              >
                {/* user + theme + secondary links etc. – unchanged, just using mobileSecondaryItems */}
                {typedUser && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 text-sm font-semibold">
                      {initialLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-100">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-zinc-400">
                        {email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
                  <ThemeToggle />
                </div>

                {mobileSecondaryItems.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="
                      flex items-center gap-2 px-4 py-3 text-sm
                      text-gray-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600
                    "
                  >
                    <Icon className="text-lg" />
                    <span>{label}</span>
                  </Link>
                ))}

                <Link
                  href="/profile"
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm
                    ${
                      isActive("/profile")
                        ? "text-rose-600 bg-rose-50"
                        : "text-gray-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600"
                    }
                  `}
                >
                  <CgProfile className="text-lg" />
                  <span>Profile</span>
                </Link>

                <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1" />

                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await onLogout();
                  }}
                  className="
                    flex w-full items-center gap-2 px-4 py-3 text-sm
                    text-red-600 hover:bg-rose-50
                  "
                >
                  <IoLogOutOutline className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
