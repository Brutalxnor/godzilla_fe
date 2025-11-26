// "use client";

// import { Suspense, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Sidebar from "../components/shared/sidebar";
// import { Filter, Search } from "lucide-react";
// import TrainerCard, { Trainer } from "./TrainerCard";

// /* ============================
//    Config + fetching
// ============================= */
// const API_BASE =
//   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as string | undefined) ??
//   "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1";

// const CATEGORIES = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"];

// async function fetchTrainers(query: string, category: string): Promise<Trainer[]> {
//   try {
//     // Hook to your backend if available:
//     // const res = await axios.get(`${API_BASE}/coaches`, { params: { q: query, category }});
//     // return (res.data?.data as any[]).map(mapper);

//     // Mock data (remove when backend is wired)
//     const mock: Trainer[] = [
//       {
//         id: 1,
//         first_name: "Ahmed",
//         second_name: "Mahmoud",
//         user_type: "coach",
//         location: "Cairo, Egypt",
//         rating: 4.9,
//         reviews_count: 156,
//         monthly_price: 49,
//         verified: true,
//         tags: ["Strength Training", "Powerlifting", "Nutrition"],
//         bio: "Certified strength coach with 8+ years of experience. Specialized in powerlifting and strength development for all levels.",
//         programs_count: 5,
//         cover_url:
//           "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
//         avatar_url:
//           "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
//       },
//       // add more items if you like…
//     ];

//     const q = query.toLowerCase().trim();
//     const cat = category.toLowerCase();
//     return mock.filter((t) => {
//       const hitQ =
//         !q ||
//         t.first_name.toLowerCase().includes(q) ||
//         t.second_name.toLowerCase().includes(q) ||
//         t.location.toLowerCase().includes(q) ||
//         t.tags.some((tg) => tg.toLowerCase().includes(q)) ||
//         t.bio.toLowerCase().includes(q);
//       const hitCat = !cat || cat === "all" || t.tags.some((tg) => tg.toLowerCase().includes(cat));
//       return hitQ && hitCat;
//     });
//   } catch {
//     return [];
//   }
// }

// /* ============================
//    Small UI bits
// ============================= */
// function CategoryTabs({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {CATEGORIES.map((c) => {
//         const active = value === c;
//         return (
//           <button
//             key={c}
//             onClick={() => onChange(c)}
//             className={[
//               "rounded-full px-3 py-1 text-xs font-medium",
//               active
//                 ? "bg-rose-100 text-rose-700"
//                 : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
//             ].join(" ")}
//           >
//             {c}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function SearchBar({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="relative w-full max-w-xl">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="Search trainers or specialties..."
//         className="w-full rounded-full bg-white pl-9 pr-10 py-2 text-sm border border-gray-200 outline-none hover:bg-gray-50"
//       />
//       <button
//         className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
//         title="Filters"
//       >
//         <Filter className="h-3.5 w-3.5" /> Filter
//       </button>
//     </div>
//   );
// }

// /* ============================
//    Page
// ============================= */
// export default function TrainersPage() {
//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState<string>("All");
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState<Trainer[]>([]);

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       setLoading(true);
//       try {
//         const list = await fetchTrainers(search, category);
//         if (!cancelled) setItems(list);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [search, category]);

//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
//         <Sidebar />
//       </Suspense>

//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//       >
//         <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//           {/* Title */}
//           <div className="flex items-center justify-between">
//             <h1 className="text-4xl font-bold">Find Your Trainer</h1>
//           </div>
//           <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

//           {/* Search */}
//           <div className="mt-8">
//             <SearchBar value={search} onChange={setSearch} />
//           </div>

//           {/* Category chips */}
//           <div className="mt-4">
//             <CategoryTabs value={category} onChange={setCategory} />
//           </div>

//           {/* count */}
//           <div className="mt-4 text-sm text-gray-600">
//             {loading ? "Loading…" : `${items.length} trainer${items.length === 1 ? "" : "s"} found`}
//           </div>

//           {/* list */}
//           <section className="mt-4 space-y-5">
//             {loading ? (
//               <div className="flex justify-center items-center py-10">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
//               </div>
//             ) : items.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-sm text-gray-600">
//                 No trainers match your search.
//               </div>
//             ) : (
//               items.map((t) => (
//                 <TrainerCard
//                   key={String(t.id)}
//                   trainer={t}
//                   onPreview={(coach) => {
//                     // TODO: open preview modal
//                     console.log("preview", coach.id);
//                   }}
//                   onViewProfile={(coach) => {
//                     // TODO: router.push(`/trainers/${coach.id}`)
//                     console.log("view profile", coach.id);
//                   }}
//                 />
//               ))
//             )}
//           </section>

//           <div className="pb-24 lg:pb-0" />
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import { Filter, Search } from "lucide-react";
import TrainerCard, { Trainer } from "./TrainerCard";
import { getAllCoaches } from "../services/trainers.service";

// const CATEGORIES = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"];

// ===== fetch + filter logic =====
async function fetchTrainers(
  query: string,
  category: string
): Promise<Trainer[]> {
  try {
    const all = await getAllCoaches();

    const q = query.toLowerCase().trim();
    const cat = category.toLowerCase();

    return all.filter((t) => {
      const hitQ =
        !q ||
        t.first_name.toLowerCase().includes(q) ||
        t.second_name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        t.bio.toLowerCase().includes(q);

      const hitCat =
        !cat ||
        cat === "all" ||
        t.tags.some((tg) => tg.toLowerCase().includes(cat));

      return hitQ && hitCat;
    });
  } catch (err) {
    console.error("Error fetching trainers:", err);
    return [];
  }
}

// ===== category tabs =====
// function CategoryTabs({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {CATEGORIES.map((c) => {
//         const active = value === c;
//         return (
//           <button
//             key={c}
//             onClick={() => onChange(c)}
//             className={[
//               "rounded-full px-3 py-1 text-xs font-medium",
//               active
//                 ? "bg-rose-100 text-rose-700"
//                 : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
//             ].join(" ")}
//           >
//             {c}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// ===== search bar =====
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search trainers or specialties..."
        className="w-full rounded-full bg-white pl-9 pr-10 py-2 text-sm border border-gray-200 outline-none hover:bg-gray-50"
      />
      <button
        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
        title="Filters"
      >
        <Filter className="h-3.5 w-3.5" /> Filter
      </button>
    </div>
  );
}

// ===== PAGE =====
export default function TrainersPage() {
  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Trainer[]>([]);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 4;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const list = await fetchTrainers(search, category);
        if (!cancelled) {
          setItems(list);
          setCurrentPage(1); // reset page on filter/search change
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [search, category]);

  // pagination math
  const totalPages = Math.ceil(items.length / trainersPerPage);
  const startIndex = (currentPage - 1) * trainersPerPage;
  const currentItems = items.slice(startIndex, startIndex + trainersPerPage);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>

      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Find Your Trainer</h1>
          </div>
          <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

          {/* Search */}
          <div className="mt-8">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Category */}
          {/* <div className="mt-4">
            <CategoryTabs value={category} onChange={setCategory} />
          </div> */}

          {/* Count */}
          <div className="mt-4 text-sm text-gray-600">
            {loading
              ? "Loading…"
              : `${items.length} trainer${items.length === 1 ? "" : "s"} found`}
          </div>

          {/* Trainers List */}
          <section className="mt-4 space-y-5">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-sm text-gray-600">
                No trainers match your search.
              </div>
            ) : (
              currentItems.map((t) => (
                <TrainerCard
                  key={String(t.id)}
                  trainer={t}
                  onPreview={(coach) => console.log("preview", coach.id)}
                  // onViewProfile={(coach) => console.log("view profile", coach.id)}
                />
              ))
            )}
          </section>

          {/* Pagination */}
          {!loading && items.length > trainersPerPage && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                Next
              </button>
            </div>
          )}

          <div className="pb-24 lg:pb-0" />
        </div>
      </main>
    </div>
  );
}
