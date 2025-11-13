import React from "react";

const page = () => {
  return <div className="min-h-screen">
  <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
    <Sidebar />
  </Suspense>
  <main
    style={shellVars}
    className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
  >;
};

export default page;
