// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { CommentsProvider } from "./community/context/CommentsContext";
import ChatNotifications from "./components/shared/ChatNotifications";
import GlobalHttpInterceptor from "./GlobalHttpInterceptor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Godzilla",
  description: "Ready to learn something new today",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This script runs before React hydrates and sets <html data-theme="...">
  const themeInit = `
    (function () {
      try {
        var t = localStorage.getItem('theme');
        if (!t) {
          t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
        // optional: ensure base colors use your CSS variables
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
     
       
        <GlobalHttpInterceptor>
        <ChatNotifications />
        <ToastContainer />
        <CommentsProvider>{children}</CommentsProvider>
        </GlobalHttpInterceptor>
      </body>
    </html>
  );
}
