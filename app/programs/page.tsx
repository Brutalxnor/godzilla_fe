// // // app/programs/page.tsx
// // "use client";

// // import { useState } from "react";
// // import ProgramCard, { Program } from "./components/programCard";
// // import Sidebar from "../components/shared/sidebar";
// // import CreateProgramModal, { CreateProgramPayload } from "./components/createProgram";



// // const CATS = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"];

// // const DATA: Program[] = [
// //   {
// //     id: "p1",
// //     title: "Strength Foundation",
// //     coach: "Ahmed Mahmoud",
// //     cover: "/godzillaImage.jpeg",
// //     rating: 4.9,
// //     ratingsCount: 156,
// //     durationWeeks: 12,
// //     level: "Beginner",
// //     tags: ["12 week program", "Video tutorials", "PDF guides", "Progress tracking"],
// //     premium: true,
// //     price: "$49/month",
// //     compareAtPrice: "$69/month",
// //     blurb:
// //       "Build a solid foundation of strength with this comprehensive beginner program.",
// //   },
// //   {
// //     id: "p2",
// //     title: "Cardio Bootcamp",
// //     coach: "Sarah Wilson",
// //     cover: "/basketball.jpeg",
// //     rating: 4.7,
// //     ratingsCount: 98,
// //     durationWeeks: 8,
// //     level: "Intermediate",
// //     tags: ["HIIT blocks", "Weekly challenges"],
// //     price: "$39/month",
// //     blurb: "Burn calories and boost endurance with structured cardio sessions.",
// //   },
// //   {
// //     id: "p3",
// //     title: "Yoga Balance",
// //     coach: "Nour El Din",
// //     cover: "/man.jpeg",
// //     rating: 4.8,
// //     ratingsCount: 210,
// //     durationWeeks: 10,
// //     level: "Beginner",
// //     tags: ["Mobility", "Breathing", "Mindfulness"],
// //     blurb: "Improve flexibility and calm the mind with gentle daily practices.",
// //   },
// // ];

// // export default function ProgramsPage() {
// //   const [tab, setTab] = useState<"browse" | "subs">("browse");
// //   const [cat, setCat] = useState("All");

// //     // NEW: modal open state
// //   const [openCreate, setOpenCreate] = useState(false);

// //   const list =
// //     cat === "All" ? DATA : DATA.filter((p) => p.title.toLowerCase().includes(cat.toLowerCase()));

// //     const shellVars = {
// //         "--sb-w": "88px",
// //         "--extra-left": "24px",
// //       } as React.CSSProperties;

// //   function handlePreview(p: Program) {
// //     // open preview modal etc.
// //     console.log("Preview", p.id);
// //   }

// //   async function handleCreateSubmit(data: CreateProgramPayload) {
// //     // TODO: call your API here
// //     console.log("CreatePost payload:", data);
// //     // optionally optimistically add to feed here
// //   }

// //   function handleSubscribe(p: Program) {
// //     // go to checkout / subscribe flow
// //     console.log("Subscribe", p.id);
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#f7f7f7]">
// //       <Sidebar />
    

// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
// //       >
// //         <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //           {/* Title + Post button */}
// //           <div className="flex items-center justify-between">
// //             <h1 className="text-4xl font-bold">Programs</h1>
      
// //             <button
// //               className="rounded-xl bg-rose-500 text-white text-1xl px-10 py-3 hover:bg-rose-600"
// //               onClick={() => setOpenCreate(true)}       
// //             >
// //               + Create
// //             </button>
            
// //           </div>
// //           <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

// //         {/* Segmented control */}
// //         <div className="mt-5 flex justify-center">
// //           <div className="relative grid w-full max-w-md grid-cols-2 rounded-full bg-gray-100 p-1">
// //             <span
// //               className={[
// //                 "absolute inset-y-1 left-1 w-1/2 rounded-full bg-white shadow-sm",
// //                 "transition-transform duration-200",
// //                 tab === "browse" ? "translate-x-0" : "translate-x-full",
// //               ].join(" ")}
// //               aria-hidden
// //             />
// //             <button
// //               className={[
// //                 "relative z-10 py-2 text-center text-sm font-semibold",
// //                 tab === "browse" ? "text-gray-900" : "text-gray-600",
// //               ].join(" ")}
// //               onClick={() => setTab("browse")}
// //             >
// //               Browse
// //             </button>
// //             <button
// //               className={[
// //                 "relative z-10 py-2 text-center text-sm font-semibold",
// //                 tab === "subs" ? "text-gray-900" : "text-gray-600",
// //               ].join(" ")}
// //               onClick={() => setTab("subs")}
// //             >
// //               My Subscriptions
// //             </button>
// //           </div>
// //         </div>

// //         {/* Categories */}
// //         <div className="mt-5 flex flex-wrap gap-2">
// //           {CATS.map((c) => {
// //             const active = cat === c;
// //             return (
// //               <button
// //                 key={c}
// //                 onClick={() => setCat(c)}
// //                 className={[
// //                   "rounded-full border px-3 py-1 text-sm",
// //                   active
// //                     ? "bg-rose-600 text-white border-rose-600"
// //                     : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
// //                 ].join(" ")}
// //               >
// //                 {c}
// //               </button>
// //             );
// //           })}
// //         </div>

// //         {/* Grid */}
// //         <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
// //           {list.map((p) => (
// //             <ProgramCard
// //               key={p.id}
// //               program={p}
// //               onPreview={handlePreview}
// //               onSubscribe={handleSubscribe}
// //             />
// //           ))}
// //         </section>

// //         {/* bottom padding for mobile bottom bar, if you have one */}
// //         <div className="pb-24 lg:pb-0" />
// //         </div>
// //       </main>

// //       <CreateProgramModal
// //         open={openCreate}
// //         onClose={() => setOpenCreate(false)}
// //         onSubmit={handleCreateSubmit}
// //         coach={{
// //           name: "Youssef Tarek",
// //           subtitle: "Share with your community",
// //           avatarUrl: "/avatar-1.jpg", 
// //         }}
// //       />
      
// //     </div>
// //   );
// // }


// // app/programs/page.tsx
// // app/programs/page.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Sidebar from "../components/shared/sidebar";
// import ProgramCard, { Program } from "./components/programCard";
// import CreateProgramModal, {
//   CreateProgramPayload,
// } from "./components/createProgram";
// import { CreateProgram, CreateProgramType, GetAllPrograms } from "./services/addProgram.service";

// // ---------- Types that mirror your API shape ----------
// export interface ApiProgram {
//   _id?: string;
//   id?: string;
//   title: string;
//   slug?: string;
//   description: string;
//   category?: string;
//   difficulty_level?: "beginner" | "intermediate" | "advanced" | string;
//   duration_weeks?: number;
//   sessions_per_week?: number;
//   minutes_per_session?: number;
//   price?: number;
//   discount_percentage?: number;
//   equipment_needed?: string;
//   space_required?: string;
//   target_audience?: string;
//   prerequisites?: string;
//   expected_results?: string;
//   includes_meal_plan?: boolean;
//   includes_supplement_guide?: boolean;
//   includes_progress_tracking?: boolean;
//   includes_chat_support?: boolean;
//   cover?: string;
//   videos?: string;
//   thumbnails?: string;
//   pdfs?: string;
//   coachName?: string;
//   rating?: number;
//   ratingsCount?: number;
// }

// export interface CreateProgramBody {
//   title: string;
//   slug: string;
//   description: string;
//   category: string;
//   difficulty_level: "beginner" | "intermediate" | "advanced" | string;
//   duration_weeks: number;
//   sessions_per_week: number;
//   minutes_per_session: number;
//   price: number;
//   discount_percentage?: number;
//   equipment_needed: string;
//   space_required: string;
//   target_audience: string;
//   prerequisites: string;
//   expected_results: string;
//   includes_meal_plan: boolean;
//   includes_supplement_guide: boolean;
//   includes_progress_tracking: boolean;
//   includes_chat_support: boolean;
//   cover?: string;
//   videos?: string;
//   thumbnails?: string;
//   pdfs?: string;
//   user_id?: string;
// }

// type ServiceOk = { ok: true };
// type ServiceErr = { error: string };

// // ---------- Small helpers ----------
// async function fileToBase64(file: File): Promise<string> {
//   const buff = await file.arrayBuffer();
//   let binary = "";
//   const bytes = new Uint8Array(buff);
//   for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
//   return btoa(binary);
// }

// function isApiProgramArray(v: unknown): v is ApiProgram[] {
//   return Array.isArray(v);
// }

// function mapApiToProgramCard(p: ApiProgram): Program {
//   const isPremium = (p.price ?? 0) > 0;
//   const originalPrice = p.price && p.discount_percentage 
//     ? p.price / (1 - p.discount_percentage / 100)
//     : undefined;

//   // Build features array from boolean flags
//   const features: string[] = [];
//   if (p.includes_meal_plan) features.push("Meal Plan");
//   if (p.includes_supplement_guide) features.push("Supplement Guide");
//   if (p.includes_progress_tracking) features.push("Progress Tracking");
//   if (p.includes_chat_support) features.push("Chat Support");
//   if (p.sessions_per_week) features.push(`${p.sessions_per_week}x/week`);
//   if (p.minutes_per_session) features.push(`${p.minutes_per_session} min/session`);

//   return {
//     id: String(p.id ?? p._id ?? crypto.randomUUID()),
//     title: p.title ?? "Untitled Program",
//     coach: p.coachName ?? "Coach",
//     cover: p.cover ?? "/placeholder.png",
//     rating: typeof p.rating === "number" ? p.rating : 4.9,
//     ratingsCount: typeof p.ratingsCount === "number" ? p.ratingsCount : 0,
//     durationWeeks: typeof p.duration_weeks === "number" ? p.duration_weeks : 12,
//     level: (p.difficulty_level as Program["level"]) ?? "Beginner",
//     tags: features,
//     premium: isPremium,
//     price: isPremium && p.price ? `$${p.price}/month` : undefined,
//     compareAtPrice: originalPrice ? `$${originalPrice.toFixed(2)}/month` : undefined,
//     blurb: p.description ?? "",
//   };
// }

// // ---------- UI constants ----------
// const CATS = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"] as const;

// export default function ProgramsPage() {
//   const [tab, setTab] = useState<"browse" | "subs">("browse");
//   const [cat, setCat] = useState<(typeof CATS)[number]>("All");
//   const [openCreate, setOpenCreate] = useState(false);

//   const [programs, setPrograms] = useState<Program[] | []>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       }) as React.CSSProperties,
//     []
//   );

//   // Load programs on mount
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       const res = await GetAllPrograms();
//       if ("error" in res) {
//         console.error(res.error);
//         setPrograms([]);
//       } else if (true) {
//         setPrograms(res);
//       } else {
//         setPrograms([]);
//       }
//       setLoading(false);
//     })();
//   }, []);

//   // const filteredList = useMemo(() => {
//   //   if (cat === "All") return programs;
//   //   const needle = cat.toLowerCase();
//   //   return programs.filter((p) => p.title.toLowerCase().includes(needle));
//   // }, [programs, cat]);

//   function handlePreview(p: Program) {
//     console.log("Preview", p.id);
//   }

//   // Called by the modal
//   async function handleCreateSubmit(data: CreateProgramPayload) {
//     try {
//       // grab user_id like your posts service
//       const stored = localStorage.getItem("user");
//       const parsed: unknown = stored ? JSON.parse(stored) : null;
//       const user_id =
//         parsed && typeof parsed === "object" && "data" in parsed
//           ? // @ts-expect-error safe lookup
//             (parsed.data?.user_id as string | undefined)
//           : undefined;

//       let coverDataUrl: string | undefined;
//       if (data.coverImageFile) {
//         const b64 = await fileToBase64(data.coverImageFile);
//         coverDataUrl = `data:${data.coverImageFile.type};base64,${b64}`;
//       }

//       // Generate slug from title if not provided
//       const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

//       const body: CreateProgramType = {
//         title: data.title,
//         slug: slug,
//         description: data.description,
//         category: data.category,
//         difficulty_level: data.difficulty_level || "beginner",
//         duration_weeks: typeof data.duration_weeks === "number" ? data.duration_weeks : 12,
//         sessions_per_week: typeof data.sessions_per_week === "number" ? data.sessions_per_week : 3,
//         minutes_per_session: typeof data.minutes_per_session === "number" ? data.minutes_per_session : 45,
//         price: typeof data.price === "number" ? data.price : 0,
//         discount_percentage: typeof data.discount_percentage === "number" ? data.discount_percentage : undefined,
//         equipment_needed: data.equipment_needed || "",
//         space_required: data.space_required || "",
//         target_audience: data.target_audience || "",
//         prerequisites: data.prerequisites || "",
//         expected_results: data.expected_results || "",
//         includes_meal_plan: data.includes_meal_plan,
//         includes_supplement_guide: data.includes_supplement_guide,
//         includes_progress_tracking: data.includes_progress_tracking,
//         includes_chat_support: data.includes_chat_support,
//         cover: coverDataUrl,
//         user_id : user_id || ""
//       };

//       console.log(body);

//       const res: ServiceOk | ServiceErr = await CreateProgram(body);
//       if ("error" in res) {
//         console.error(res.error);
//         return;
//       }

//       // refresh list
//       const refreshed = await GetAllPrograms();
//       if (!("error" in refreshed) && isApiProgramArray(refreshed)) {
//         setPrograms(refreshed.map(mapApiToProgramCard));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function handleSubscribe(p: Program) {
//     console.log("Subscribe", p.id);
//   }

//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <Sidebar />

//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
//       >
//         <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//           {/* Title + Create */}
//           <div className="flex items-center justify-between">
//             <h1 className="text-4xl font-bold">Programs</h1>
//             <button
//               className="rounded-xl bg-rose-500 text-white text-1xl px-10 py-3 hover:bg-rose-600"
//               onClick={() => setOpenCreate(true)}
//             >
//               + Create
//             </button>
//           </div>
//           <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

//           {/* Tabs */}
//           <div className="mt-5 flex justify-center">
//             <div className="relative grid w-full max-w-md grid-cols-2 rounded-full bg-gray-100 p-1">
//               <span
//                 className={[
//                   "absolute inset-y-1 left-1 w-1/2 rounded-full bg-white shadow-sm",
//                   "transition-transform duration-200",
//                   tab === "browse" ? "translate-x-0" : "translate-x-full",
//                 ].join(" ")}
//                 aria-hidden
//               />
//               <button
//                 className={[
//                   "relative z-10 py-2 text-center text-sm font-semibold",
//                   tab === "browse" ? "text-gray-900" : "text-gray-600",
//                 ].join(" ")}
//                 onClick={() => setTab("browse")}
//               >
//                 Browse
//               </button>
//               <button
//                 className={[
//                   "relative z-10 py-2 text-center text-sm font-semibold",
//                   tab === "subs" ? "text-gray-900" : "text-gray-600",
//                 ].join(" ")}
//                 onClick={() => setTab("subs")}
//               >
//                 My Subscriptions
//               </button>
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="mt-5 flex flex-wrap gap-2">
//             {CATS.map((c) => {
//               const active = cat === c;
//               return (
//                 <button
//                   key={c}
//                   onClick={() => setCat(c)}
//                   className={[
//                     "rounded-full border px-3 py-1 text-sm",
//                     active
//                       ? "bg-rose-600 text-white border-rose-600"
//                       : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
//                   ].join(" ")}
//                 >
//                   {c}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Grid */}
//           {/* <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
//             {loading ? (
//               <div className="text-sm text-gray-500">Loading programs…</div>
//             ) : programs.length === 0 ? (
//               <div className="text-sm text-gray-500">No programs found.</div>
//             ) : (
//               // programs?.map((p) => (
//               //   <ProgramCard
//               //     key={p.id}
//               //     program={p}
//               //     onPreview={handlePreview}
//               //     onSubscribe={handleSubscribe}
//               //   />
//               // ))

//               Array.isArray(programs) ? programs?.map((p) => (
//                 <ProgramCard
//                 key={p.id}
//                 program={p}
//                 onPreview={handlePreview}
//                 onSubscribe={handleSubscribe}
//               />
//             )) : <h1>askdjas</h1>
//             )}
//           </section> */}
//           <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
//   {loading ? (
//     <div className="text-sm text-gray-500">Loading programs…</div>
//   ) : (() => {
//       // Normalize to an array in case the API returns a single object
//       const list = Array.isArray(programs)
//         ? programs
//         : programs
//         ? [programs as Program]
//         : [];

//       if (list.length === 0) {
//         return <div className="text-sm text-gray-500">No programs found.</div>;
//       }

//       return list.map((p) => (
//         <ProgramCard
//           key={p.id}
//           program={p}
//           onPreview={handlePreview}
//           onSubscribe={handleSubscribe}
//         />
//       ));
//     })()}
// </section>


//           <div className="pb-24 lg:pb-0" />
//         </div>
//       </main>

//       {/* Modal */}
//       <CreateProgramModal
//         open={openCreate}
//         onClose={() => setOpenCreate(false)}
//         onSubmit={handleCreateSubmit}
//         coach={{
//           name: "Youssef Tarek",
//           subtitle: "Share with your community",
//           avatarUrl: "/avatar-1.jpg",
//         }}
//       />
//     </div>
//   );
// }


// app/programs/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import ProgramCard, { Program } from "./components/programCard";
import CreateProgramModal, {
  CreateProgramPayload,
} from "./components/createProgram";
import { CreateProgram, CreateProgramType, GetAllPrograms } from "./services/addProgram.service";

// ---------- Types that mirror your API shape ----------
export interface ApiProgram {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  description: string;
  category?: string;
  difficulty_level?: "beginner" | "intermediate" | "advanced" | string;
  duration_weeks?: number;
  sessions_per_week?: number;
  minutes_per_session?: number;
  price?: number;
  discount_percentage?: number;
  equipment_needed?: string;
  space_required?: string;
  target_audience?: string;
  prerequisites?: string;
  expected_results?: string;
  includes_meal_plan?: boolean;
  includes_supplement_guide?: boolean;
  includes_progress_tracking?: boolean;
  includes_chat_support?: boolean;
  cover_image_url?: string;
  videos?: string;
  thumbnails?: string;
  pdfs?: string;
  coachName?: string;
  rating?: number;
  ratingsCount?: number;
}

// extra fields that can come from your backend without changing ApiProgram
type ApiProgramExtras = {
  cover_image_url?: string | null;
  users?: {
    first_name?: string | null;
    second_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export interface CreateProgramBody {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: "beginner" | "intermediate" | "advanced" | string;
  duration_weeks: number;
  sessions_per_week: number;
  minutes_per_session: number;
  price: number;
  discount_percentage?: number;
  equipment_needed: string;
  space_required: string;
  target_audience: string;
  prerequisites: string;
  expected_results: string;
  includes_meal_plan: boolean;
  includes_supplement_guide: boolean;
  includes_progress_tracking: boolean;
  includes_chat_support: boolean;
  cover_image_url?: string;
  videos?: string;
  thumbnails?: string;
  pdfs?: string;
  user_id?: string;
}

type ServiceOk = { ok: true };
type ServiceErr = { error: string };

// ---------- Small helpers ----------
async function fileToBase64(file: File): Promise<string> {
  const buff = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buff);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function isApiProgramArray(v: unknown): v is ApiProgram[] {
  return Array.isArray(v);
}

function hasDataField(v: unknown): v is { data: unknown } {
  return typeof v === "object" && v !== null && "data" in (v as { data?: unknown });
}

function toApiProgramArray(v: unknown): ApiProgram[] {
  const payload = hasDataField(v) ? (v as { data: unknown }).data : v;
  if (Array.isArray(payload)) {
    return payload as ApiProgram[];
  }
  if (typeof payload === "object" && payload !== null) {
    return [payload as ApiProgram];
  }
  return [];
}

function titleCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// ---------- MAPPER: API → ProgramCard ----------
function mapApiToProgramCard(p: ApiProgram): Program {
  // read optional backend fields without changing your ApiProgram type
  const pExtra = p as ApiProgram & ApiProgramExtras;

  const isPremium = (p.price ?? 0) > 0;
  const originalPrice =
    p.price && p.discount_percentage
      ? p.price / (1 - p.discount_percentage / 100)
      : undefined;

  const coachFromUsers = `${pExtra.users?.first_name ?? ""} ${pExtra.users?.second_name ?? ""}`.trim();

  // Build features array from boolean flags
  const features: string[] = [];
  if (p.includes_meal_plan) features.push("Meal Plan");
  if (p.includes_supplement_guide) features.push("Supplement Guide");
  if (p.includes_progress_tracking) features.push("Progress Tracking");
  if (p.includes_chat_support) features.push("Chat Support");
  if (p.sessions_per_week) features.push(`${p.sessions_per_week}x/week`);
  if (p.minutes_per_session) features.push(`${p.minutes_per_session} min/session`);

  return {
    id: String(p.id ?? p._id ?? crypto.randomUUID()),
    title: p.title ?? "Untitled Program",
    // prefer nested users name if present
    coach: coachFromUsers || p.coachName || "Coach",
    // prefer backend-saved URL
    cover: pExtra.cover_image_url ??  "/placeholder.png",
    rating: typeof p.rating === "number" ? p.rating : 4.9,
    ratingsCount: typeof p.ratingsCount === "number" ? p.ratingsCount : 0,
    durationWeeks: typeof p.duration_weeks === "number" ? p.duration_weeks : 12,
    level: (titleCase(String(p.difficulty_level ?? "Beginner")) as Program["level"]) ?? "Beginner",
    tags: features,
    premium: isPremium,
    price: isPremium && p.price ? `$${p.price}/month` : undefined,
    compareAtPrice: originalPrice ? `$${originalPrice.toFixed(2)}/month` : undefined,
    blurb: p.description ?? "",
  };
}

// ---------- UI constants ----------
const CATS = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"] as const;

export default function ProgramsPage() {
  const [tab, setTab] = useState<"browse" | "subs">("browse");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [openCreate, setOpenCreate] = useState(false);

  const [programs, setPrograms] = useState<Program[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const toStringArray = (v: unknown): string[] =>
    Array.isArray(v)
      ? v.map(String).map(s => s.trim()).filter(Boolean)
      : typeof v === "string"
      ? v.split(",").map(s => s.trim()).filter(Boolean)
      : [];

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      }) as React.CSSProperties,
    []
  );

  // Load programs on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await GetAllPrograms();
      try {
        const list = toApiProgramArray(res);
        setPrograms(list.map(mapApiToProgramCard));
      } catch (e) {
        console.error(e);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handlePreview(p: Program) {
    console.log("Preview", p.id);
  }

  // Called by the modal
  async function handleCreateSubmit(data: CreateProgramPayload) {
    try {
      const stored = localStorage.getItem("user");
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      const user_id =
        parsed && typeof parsed === "object" && "data" in (parsed as { data?: { user_id?: string } })
          ? (parsed as { data?: { user_id?: string } }).data?.user_id
          : undefined;
    
      let coverDataUrl: string | undefined;
      if (data.coverImageFile) {
        const b64 = await fileToBase64(data.coverImageFile);
        coverDataUrl = `data:${data.coverImageFile.type};base64,${b64}`;
      }

      // Generate slug from title if not provided
      const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      const body: CreateProgramType = {
        title: data.title,
        slug: slug,
        description: data.description,
        category: data.category,
        difficulty_level: data.difficulty_level || "beginner",
        duration_weeks: typeof data.duration_weeks === "number" ? data.duration_weeks : 12,
        sessions_per_week: typeof data.sessions_per_week === "number" ? data.sessions_per_week : 3,
        minutes_per_session: typeof data.minutes_per_session === "number" ? data.minutes_per_session : 45,
        price: typeof data.price === "number" ? data.price : 0,
        discount_percentage: typeof data.discount_percentage === "number" ? data.discount_percentage : undefined,
        equipment_needed: toStringArray(data.equipment_needed), 
        space_required: data.space_required || "",
        target_audience: data.target_audience || "",
        prerequisites: data.prerequisites || "",
        expected_results: data.expected_results || "",
        includes_meal_plan: data.includes_meal_plan,
        includes_supplement_guide: data.includes_supplement_guide,
        includes_progress_tracking: data.includes_progress_tracking,
        includes_chat_support: data.includes_chat_support,
        cover_image_url: coverDataUrl,
        user_id : user_id || ""
      };

      const res: ServiceOk | ServiceErr = await CreateProgram(body);
      if ("error" in res) {
        console.error(res.error);
        return;
      }

      // refresh list
      const refreshed = await GetAllPrograms();
      const list = toApiProgramArray(refreshed);
      setPrograms(list.map(mapApiToProgramCard));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSubscribe(p: Program) {
    console.log("Subscribe", p.id);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar />

      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          {/* Title + Create */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Programs</h1>
            <button
              className="rounded-xl bg-rose-500 text-white text-1xl px-10 py-3 hover:bg-rose-600"
              onClick={() => setOpenCreate(true)}
            >
              + Create
            </button>
          </div>
          <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

          {/* Tabs */}
          <div className="mt-5 flex justify-center">
            <div className="relative grid w-full max-w-md grid-cols-2 rounded-full bg-gray-100 p-1">
              <span
                className={[
                  "absolute inset-y-1 left-1 w-1/2 rounded-full bg-white shadow-sm",
                  "transition-transform duration-200",
                  tab === "browse" ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
                aria-hidden
              />
              <button
                className={[
                  "relative z-10 py-2 text-center text-sm font-semibold",
                  tab === "browse" ? "text-gray-900" : "text-gray-600",
                ].join(" ")}
                onClick={() => setTab("browse")}
              >
                Browse
              </button>
              <button
                className={[
                  "relative z-10 py-2 text-center text-sm font-semibold",
                  tab === "subs" ? "text-gray-900" : "text-gray-600",
                ].join(" ")}
                onClick={() => setTab("subs")}
              >
                My Subscriptions
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-5 flex flex-wrap gap-2">
            {CATS.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={[
                    "rounded-full border px-3 py-1 text-sm",
                    active
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1">
            {loading ? (
              <div className="text-sm text-gray-500">Loading programs…</div>
            ) : programs.length === 0 ? (
              <div className="text-sm text-gray-500">No programs found.</div>
            ) : (
              programs.map((p) => (
                <ProgramCard
                  key={p.id}
                  program={p}
                  onPreview={handlePreview}
                  onSubscribe={handleSubscribe}
                />
              ))
            )}
          </section>

          <div className="pb-24 lg:pb-0" />
        </div>
      </main>

      {/* Modal */}
      <CreateProgramModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        coach={{
          name: "Youssef Tarek",
          subtitle: "Share with your community",
          avatarUrl: "/avatar-1.jpg",
        }}
      />
    </div>
  );
}



