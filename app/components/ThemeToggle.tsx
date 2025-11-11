// // "use client";

// // import { useEffect, useState } from "react";
// // import { Moon, Sun } from "lucide-react";

// // type Theme = "light" | "dark";

// // const getInitial = (): Theme => {
// //   if (typeof window === "undefined") return "light";
// //   const saved = localStorage.getItem("theme");
// //   if (saved === "light" || saved === "dark") return saved;
// //   // fall back to system
// //   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// // };

// // export default function ThemeToggle() {
// //   const [theme, setTheme] = useState<Theme>(getInitial);

// //   useEffect(() => {
// //     document.documentElement.setAttribute("data-theme", theme);
// //     localStorage.setItem("theme", theme);
// //   }, [theme]);

// //   return (
// //     <button
// //       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
// //       className="inline-flex items-center justify-center rounded-full border px-2.5 py-2 text-sm
// //                  border-[var(--border)] hover:bg-[var(--chip)]"
// //       title="Toggle theme"
// //       aria-label="Toggle theme"
// //     >
// //       {theme === "dark" ? (
// //         <Sun className="h-4 w-4" />
// //       ) : (
// //         <Moon className="h-4 w-4" />
// //       )}
// //     </button>
// //   );
// // }

// // "use client";

// // import { useEffect, useState } from "react";
// // import { Moon, Sun } from "lucide-react";

// // type Theme = "light" | "dark";

// // const getInitial = (): Theme => {
// //   if (typeof window === "undefined") return "light";
// //   const saved = localStorage.getItem("theme");
// //   if (saved === "light" || saved === "dark") return saved;
// //   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// // };

// // export default function ThemeToggle() {
// //   const [theme, setTheme] = useState<Theme>(getInitial);

// //   useEffect(() => {
// //     document.documentElement.setAttribute("data-theme", theme);
// //     localStorage.setItem("theme", theme);
// //   }, [theme]);

// //   return (
// //     <button
// //       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
// //       className="inline-flex items-center justify-center rounded-full border px-2.5 py-2 text-sm
// //                  border-[var(--border)] hover:bg-[var(--chip)]"
// //       title="Toggle theme"
// //       aria-label="Toggle theme"
// //     >
// //       {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
// //     </button>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { Moon, Sun } from "lucide-react";

// type Theme = "light" | "dark";

// const getInitial = (): Theme => {
//   if (typeof window === "undefined") return "light";
//   const saved = localStorage.getItem("theme");
//   if (saved === "light" || saved === "dark") return saved;
//   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// };

// export default function ThemeToggle() {
//   const [theme, setTheme] = useState<Theme>(getInitial);

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   return (
//     <button
//       onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className="inline-flex items-center justify-center rounded-full border px-2.5 py-2
//                  border-[var(--border)] hover:bg-[var(--chip)]"
//       title="Toggle theme"
//       aria-label="Toggle theme"
//     >
//       {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
//     </button>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const getInitial = (): Theme => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    // Apply to <html>
    document.documentElement.setAttribute("data-theme", theme);
    // Persist
    localStorage.setItem("theme", theme);
    // 🔔 Notify the rest of the app (our custom event)
    window.dispatchEvent(new CustomEvent<Theme>("theme-change", { detail: theme }));
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-full border px-2.5 py-2
                 border-[var(--border)] hover:bg-[var(--chip)]"
      title="Toggle theme"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
