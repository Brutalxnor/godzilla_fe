"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    // لما يجي الـ URL من Google، ابعتها للـ backend عشان يجيب الـ session
    const sendToBackend = async () => {
      const res = await fetch(
        "http://localhost:4000/api/v1/auth/google/callback?" +
          window.location.search
      );
      const data = await res.json();

      if (data.success) {
        // احفظ الـ token، وروح للـ dashboard
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        alert("فشل تسجيل الدخول");
      }
    };

    sendToBackend();
  }, []);

  return <div>جاري تسجيل الدخول...</div>;
}
