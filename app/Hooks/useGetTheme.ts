"use client";
// import { User } from "@/types/admin";
import { useEffect, useState } from "react";

const useGetTheme = () => {
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      try {
        setTheme(localTheme as string);
      } catch (err) {
        console.error("Error parsing local user:", err);
      }
    }
  }, []);

  return { theme };
};

export default useGetTheme;
