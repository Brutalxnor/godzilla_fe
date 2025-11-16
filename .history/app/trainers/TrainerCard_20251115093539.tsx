// "use client";

// import { Star, MapPin, CheckCircle2, Eye, UserRound } from "lucide-react";
// import React from "react";

// /** Public type you can import elsewhere */
// export type Trainer = {
//   id: string | number;
//   first_name: string;
//   second_name: string;
//   user_type: "coach" | "athlete" | string;
//   location: string;
//   rating: number;            // 0..5
//   reviews_count: number;
//   monthly_price: number;     // 49 -> "$49/month"
//   verified: boolean;
//   tags: string[];
//   bio: string;
//   programs_count: number;
//   cover_url?: string | null;
//   avatar_url?: string | null;
// };

// const toTitleCase = (s: string): string =>
//   s
//     .trim()
//     .split(/\s+/)
//     .map((part) =>
//       part
//         .split(/([-'])/)
//         .map((seg) =>
//           seg === "-" || seg === "'"
//             ? seg
//             : seg
//             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
//             : seg
//         )
//         .join("")
//     )
//     .join(" ");

// function Chip({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
//       {children}
//     </span>
//   );
// }

// export default function TrainerCard({
//   trainer,
//   onPreview,
//   onViewProfile,
// }: {
//   trainer: Trainer;
//   onPreview?: (t: Trainer) => void;
//   onViewProfile?: (t: Trainer) => void;
// }) {
//   const t = trainer;
//   const fullName = toTitleCase(`${t.first_name} ${t.second_name}`.trim());

//   return (
//     <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//       {/* Cover */}
//       <div className="relative h-64 w-full bg-gray-100">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={
//             t.cover_url ||
//             "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
//           }
//           alt={`${fullName} cover`}
//           className="h-full w-full object-cover"
//         />
//         <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
//           ${t.monthly_price}/month
//         </span>
//       </div>

//       {/* Body */}
//       <div className="p-4">
//         <div className="flex items-start gap-3">
//           <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={
//                 t.avatar_url ||
//                 "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
//               }
//               alt={fullName}
//               className="h-full w-full object-cover"
//             />
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2">
//               <h3 className="text-[15px] font-semibold">{fullName}</h3>
//               {t.verified && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700">
//                   <CheckCircle2 className="h-3.5 w-3.5" />
//                   Verified
//                 </span>
//               )}
//             </div>

//             <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-gray-600">
//               <span className="inline-flex items-center gap-1">
//                 <Star className="h-3.5 w-3.5 text-yellow-500" />
//                 {t.rating.toFixed(1)} ({t.reviews_count})
//               </span>
//               <span className="inline-flex items-center gap-1">
//                 <MapPin className="h-3.5 w-3.5" />
//                 {t.location}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* tags */}
//         {t.tags.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-2">
//             {t.tags.map((tg, i) => (
//               <Chip key={`${t.id}-tag-${i}`}>{tg}</Chip>
//             ))}
//           </div>
//         )}

//         {/* bio */}
//         <p className="mt-3 text-sm text-gray-700 line-clamp-2">{t.bio}</p>

//         {/* meta */}
//         <div className="mt-3 flex items-center justify-between text-[13px] text-gray-600">
//           <span>{t.programs_count} programs</span>
//           <span>{t.reviews_count} reviews</span>
//         </div>

//         {/* actions */}
//         <div className="mt-4 flex items-center gap-3">
//           {/* <button
//             className="inline-flex w-full items-center justify-center gap-2 cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
//             onClick={() => onPreview?.(t)}
//           >
//             <Eye className="h-4 w-4" />
//             Preview
//           </button> */}
//           <button
//             className="inline-flex w-full items-center justify-center cursor-pointer  gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
//             onClick={() => onViewProfile?.(t)}
//           >
//             <UserRound className="h-4 w-4" />
//             View Programs
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

"use client";

import { Star, MapPin, CheckCircle2, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ added
import { Program } from "../types/type";
import { GetProgramsByCoachId } from "../programs/services/addProgram.service";

/** Public type you can import elsewhere */
export type Trainer = {
  id: string | number;
  first_name: string;
  second_name: string;
  user_type: "coach" | "athlete" | string;
  location: string;
  rating: number; // 0..5
  reviews_count: number;
  monthly_price: number; // 49 -> "$49/month"
  verified: boolean;
  tags: string[];
  bio: string;
  programs_count: number;
  cover_url?: string | null;
  avatar_url?: string | null;
};

const toTitleCase = (s: string): string =>
  s
    .trim()
    .split(/\s+/)
    .map((part) =>
      part
        .split(/([-'])/)
        .map((seg) =>
          seg === "-" || seg === "'"
            ? seg
            : seg
            ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
            : seg
        )
        .join("")
    )
    .join(" ");

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
      {children}
    </span>
  );
}

export default function TrainerCard({
  trainer,
  onPreview,
}: {
  trainer: Trainer;
  onPreview?: (t: Trainer) => void;
}) {
  const router = useRouter(); // ✅ added
  const t = trainer;
  const fullName = toTitleCase(`${t.first_name} ${t.second_name}`.trim());
  const [programs, setPrograms] = useState<Program[]>([]);


  useEffect(() => {
    const fetchGetProgramsByCoachId = async () => {
      const data = await GetProgramsByCoachId(t)
    }
  })

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-64 w-full bg-gray-100">
        <img
          src={
            t.cover_url ||
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
          }
          alt={`${fullName} cover`}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
          ${t.monthly_price}/month
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={
                t.avatar_url ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
              }
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold">{fullName}</h3>
              {t.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                {t.rating.toFixed(1)} ({t.reviews_count})
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {t.location}
              </span>
            </div>
          </div>
        </div>

        {/* tags */}
        {t.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {t.tags.map((tg, i) => (
              <Chip key={`${t.id}-tag-${i}`}>{tg}</Chip>
            ))}
          </div>
        )}

        {/* bio */}
        <p className="mt-3 text-sm text-gray-700 line-clamp-2">{t.bio}</p>

        {/* meta */}
        <div className="mt-3 flex items-center justify-between text-[13px] text-gray-600">
          <span>{t.programs_count} programs</span>
          <span>{t.reviews_count} reviews</span>
        </div>

        {/* actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            className="inline-flex w-full items-center justify-center cursor-pointer gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
            onClick={() => router.push(`/trainers/${t.id}/programs`)} // ✅ navigates
          >
            <UserRound className="h-4 w-4" />
            View Programs
          </button>
        </div>
      </div>
    </article>
  );
}
