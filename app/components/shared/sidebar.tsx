// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   AiOutlineHome,
//   AiOutlineTrophy,
// } from "react-icons/ai";
// import { FiUsers, FiMessageSquare } from "react-icons/fi";
// import { MdOutlineFitnessCenter } from "react-icons/md";
// import { CgProfile } from "react-icons/cg";
// import { ReactElement } from "react";

// type Item = {
//   href: string;
//   label: string;
//   Icon: ReactElement;
// };

// const items: Item[] = [
//   { href: "/dashboard", label: "Home", Icon: <AiOutlineHome/> },
//   { href: "/community", label: "Community", Icon: <FiUsers/> },
//   { href: "/trainers", label: "Trainers", Icon: <MdOutlineFitnessCenter/> },
//   { href: "/programs", label: "Programs", Icon: <AiOutlineTrophy/> },
//   { href: "/chat", label: "Chat", Icon: <FiMessageSquare/> },
//   { href: "/profile", label: "Profile", Icon: <CgProfile/> },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   const isActive = (href: string) =>
//     pathname === href || pathname?.startsWith(`${href}/`);

//   return (
//     <>
//       {/* Left sidebar (>= lg) */}
//       <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[88px] flex-col items-center gap-4 bg-white border-r border-gray-200 py-4 z-40">
//         <div className="mt-2 mb-4 h-10 w-10 rounded-full bg-rose-500 grid place-items-center text-white font-bold">
//           GZ
//         </div>

//         <nav className="flex flex-col gap-2">
//           {items.map(({ href, label, Icon }) => {
//             const active = isActive(href);
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={[
//                   "group relative grid place-items-center w-14 h-14 rounded-2xl transition-all",
//                   active
//                     ? "bg-rose-50 text-rose-600 shadow-sm"
//                     : "text-gray-500 hover:bg-gray-100",
//                 ].join(" ")}
//                 aria-label={label}
//               >
//                 <div
//                   className={[
//                     "text-xl transition-colors",
//                     active ? "text-rose-600" : "group-hover:text-gray-800",
//                   ].join(" ")}
//                 />
//                 <span className="pointer-events-none absolute -bottom-6 text-[11px] text-gray-500">
//                   {label}
//                 </span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Bottom nav (< lg) */}
//       <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
//         <div className="mx-auto max-w-screen-md">
//           <div className="mx-4 mb-3 rounded-2xl bg-white/90 backdrop-blur border border-gray-200 shadow-lg p-2 flex justify-between">
//             {items.map(({ href, label, Icon }) => {
//               const active = isActive(href);
//               return (
//                 <Link
//                   key={href}
//                   href={href}
//                   className={[
//                     "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors",
//                     active ? "text-rose-600" : "text-gray-500 hover:text-gray-800",
//                   ].join(" ")}
//                 >
//                   <div
//                     className={[
//                       "text-[22px] leading-none",
//                       active ? "text-rose-600" : "",
//                     ].join(" ")}
//                   />
//                   <span className="text-[11px]">{label}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

// components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
import { FiUsers, FiMessageSquare } from "react-icons/fi";
import { MdOutlineFitnessCenter } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

type Item = {
  href: string;
  label: string;
  Icon: IconType;
};

const items: Item[] = [
  { href: "/", label: "Home", Icon: AiOutlineHome },
  { href: "/community", label: "Community", Icon: FiUsers },
  { href: "/trainers", label: "Trainers", Icon: MdOutlineFitnessCenter },
  { href: "/programs", label: "Programs", Icon: AiOutlineTrophy },
  { href: "/chat", label: "Chat", Icon: FiMessageSquare },
  { href: "/profile", label: "Profile", Icon: CgProfile },
];

// same helper used in your old sidebar, so active state works with locales
const stripLocale = (p?: string) => {
  if (!p) return "/";
  const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/);
  return m ? p.slice(m[0].length) || "/" : p;
};

export default function Sidebar() {
  const pathnameRaw = usePathname();
  const pathname = stripLocale(pathnameRaw);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      {/* Hover-to-expand LEFT SIDEBAR (>= lg) */}
      <aside
        className="
          group fixed left-0 top-0 z-40 hidden h-screen
          w-[88px] hover:w-[260px]
          overflow-hidden border-r border-gray-200 
          transition-[width] duration-300 lg:flex bg-white
        "
      >
        <div className="flex h-full w-full flex-col px-2 py-5">
          {/* Brand */}
          <div className="flex items-center gap-5 px-2 py-10  ">
            <div className="grid h-12 w-12 p-4 place-items-center rounded-full bg-rose-500 text-white font-bold text-sm leading-none">
              GZ
            </div>
            <span
              className="
                text-base font-semibold text-gray-800
                opacity-0 transition-all duration-200
                group-hover:opacity-100
              "
            >
              Godzilla
            </span>
          </div>

          {/* Nav */}
          <nav className="mt flex flex-1 flex-col gap-1 px-2 py-0">
            {items.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "relative flex items-center gap-3 rounded-xl px-3 py-5",
                    "transition-colors",
                    active
                      ? "bg-rose-500/5 text-rose-500"
                      : "text-gray-600 hover:bg-red-50",
                  ].join(" ")}
                >
                  {/* Active indicator bar (soft) */}
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full",
                      active ? "bg-rose-400" : "bg-transparent",
                    ].join(" ")}
                  />
                  <Icon
                    className={[
                      "text-[25px] shrink-0",
                      active ? "text-rose-400" : "text-gray-600",
                    ].join(" ")}
                  />
                  <span
                    className="
                      ml-5 text-[14px] text-gray-800
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

          <div className="h-4" />
        </div>
      </aside>

      {/* ===== BOTTOM TAB BAR (< lg) — same behavior as your old sidebar ===== */}
      <nav
        className="
          lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white
          border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
          pb-[max(env(safe-area-inset-bottom),0px)]
        "
      >
        <ul className="grid grid-cols-6">
          {items.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className={[
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "transition-colors",
                    active
                        ? "bg-rose-100 text-rose-600"
                        : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
                  ].join(" ")}
                >
                  <Icon className="text-xl" />
                  <span className="text-[11px] font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

