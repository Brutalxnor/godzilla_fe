// "use client";
// // import { User } from "@/types/admin";
// import { useEffect, useState } from "react";

// const useGetTheme = () => {
//   const [theme, setTheme] = useState<string>("");

//   useEffect(() => {
//     const localTheme = localStorage.getItem("theme");
//     if (localTheme) {
//       try {
//         setTheme(localTheme as string);
//       } catch (err) {
//         console.error("Error parsing local user:", err);
//       }
//     }
//   }, []);

//   return { theme };
// };

// export default useGetTheme;
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const readFromDomOrStorage = (): Theme => {
  if (typeof window === "undefined") return "light";

  // 1) Prefer what <html data-theme=""> currently has
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (fromDom === "light" || fromDom === "dark") return fromDom;

  // 2) Fallback to localStorage
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  // 3) Last fallback: system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const useGetTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => readFromDomOrStorage());

  useEffect(() => {
    // Make sure we sync once on mount (in case DOM changed before hook used)
    setTheme(readFromDomOrStorage());

    const handler = (e: Event) => {
      const custom = e as CustomEvent<Theme>;
      // extra safety check
      if (custom.detail === "light" || custom.detail === "dark") {
        setTheme(custom.detail);
      }
    };

    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  return { theme };
};

export default useGetTheme;
