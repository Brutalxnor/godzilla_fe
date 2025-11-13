import Sidebar from "@/app/components/shared/sidebar";
import React, { Suspense, useMemo } from "react";

const Page = () => {
  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>
      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-0 py-4 sm:py-6 md:py-8">
          <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 md:px-6 lg:px-0 pb-24"></div>
        </div>
      </main>
    </div>
  );
};

export default Page;
