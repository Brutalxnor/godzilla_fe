
"use client";

import { useEffect } from "react";
import axios from "axios";

type Props = {
  children: React.ReactNode;
};

export default function GlobalHttpInterceptor({ children }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ---- ORIGINAL FETCH ----
    const originalFetch = window.fetch.bind(window);

    // ---- OVERRIDE FETCH ----
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = localStorage.getItem("token");

      // Attach token to every request
      const headers = new Headers(init?.headers || {});
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await originalFetch(input, {
        ...init,
        headers,
      });

      // ---- GLOBAL 401 HANDLER ----
      if (response.status === 401) {
        try {
          localStorage.clear();   // clear all localStorage
          sessionStorage.clear(); // clear all sessionStorage
        } catch {
          // ignore
        }
        window.location.href = "/login";
      }

      //

      return response;
    };

    // ---- AXIOS INTERCEPTOR ----
    const axiosInterceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          try {
            localStorage.clear();   // clear all localStorage
            sessionStorage.clear(); // clear all sessionStorage
          } catch {
            // ignore
          }
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    );

    // ---- CLEANUP ON UNMOUNT ----
    return () => {
      window.fetch = originalFetch;
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, []);

  return <>{children}</>;
}
