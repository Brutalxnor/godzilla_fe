// components/shared/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { AiOutlineHome, AiOutlineTrophy } from "react-icons/ai";
import { FiUsers, FiMessageSquare } from "react-icons/fi";
import { MdOutlineFitnessCenter } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { LogoutService } from "@/app/auth/services/logout.service";
import useGetTheme from "@/app/Hooks/useGetTheme";

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

// locale-safe path strip
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

  const onLogout = async () => {
    await LogoutService(); // handles clearing + redirect + reload
  };

  const {theme} = useGetTheme()

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
          <div className="flex items-center gap-5 px-2 py-10">
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
          <nav className="flex flex-1 flex-col gap-1 px-2">
            {items.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    `relative  flex items-center gap-3 rounded-xl px-3 py-5`,
                    "transition-colors",
                    active
                      ? "bg-rose-500/5 text-rose-500"
                      : "text-gray-600 hover:bg-red-50",
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
                      active ? "text-rose-400" : "text-gray-600",
                    ].join(" ")}
                  />
                  <span
                    className="
                      ml-5 text-[14px] text-black
                      max-w-0 overflow-hidden opacity-0
                      transition-all duration-200
                      group-hover:max-w-[160px] group-hover:opacity-100 font-extrabold
                    "
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout pinned at bottom */}
          {/* <div className="mt-auto px-2 pb-2">
            <button
              onClick={onLogout}
              className="
                relative flex w-full items-center gap-3 rounded-xl px-3 py-5
                text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors
              "
              aria-label="Logout"
            >
              <IoLogOutOutline className="text-[25px] shrink-0" />
              <span
                className="
                  ml-5 text-[14px] text-gray-800
                  max-w-0 overflow-hidden opacity-0
                  transition-all duration-200
                  group-hover:max-w-[160px] group-hover:opacity-100
                "
              >
                Logout
              </span>
            </button>
          </div> */}
        </div>
      </aside>

      {/* Bottom tab bar (< lg) with Logout item */}
      <nav
        className="
          lg:hidden fixed flex justify-between w-full bottom-0 inset-x-0 z-50 bg-white
          border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]
          pb-[max(env(safe-area-inset-bottom),0px)]
        "
      >
        <ul className="flex justify-between w-full mx-3">
          {items.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className={[
                    "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors",
                    active
                      ? "text-rose-600 bg-rose-100"
                      : "text-gray-700 hover:bg-rose-50 hover:text-rose-600",
                  ].join(" ")}
                >
                  <Icon className="text-xl" />
                  <span className="text-[11px] font-medium">{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Logout (mobile) */}
          {/* <li className="flex">
            <button
              onClick={onLogout}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              aria-label="Logout"
            >
              <IoLogOutOutline className="text-xl" />
              <span className="text-[11px] font-medium">Logout</span>
            </button>
          </li> */}
        </ul>
      </nav>
    </>
  );
}
