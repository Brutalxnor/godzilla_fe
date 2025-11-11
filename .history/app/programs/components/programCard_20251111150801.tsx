// // components/shared/ProgramCard.tsx
// "use client";

// import useGetUser from "@/app/Hooks/useGetUser";
// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { FiStar, FiClock } from "react-icons/fi";
// import { LuDumbbell } from "react-icons/lu";
// import { toast } from "react-toastify";

// export type Program = {
//   id: string;
//   title: string;
//   coach: string;
//   cover: string | null | undefined; // allow nulls from API
//   cover_image_url?: string | null | undefined; // allow nulls from API
//   rating?: number | string; // allow string/undefined
//   ratingsCount?: number;
//   durationWeeks?: number | string;
//   level?: "Beginner" | "Intermediate" | "Advanced" | string;
//   tags?: string[];
//   premium?: boolean;
//   price?: string;
//   compareAtPrice?: string;
//   blurb?: string;
//   description?: string;
//   users?: {
//     avatar_url: string;
//     first_name: string;
//     id: string;
//     second_name: string;
//   };
// };

// export default function ProgramCard({
//   program,
//   onPreview,
//   onSubscribe,
// }: {
//   program: Program;
//   onPreview?: (p: Program) => void;
//   onSubscribe?: (p: Program) => void;
// }) {
//   const {
//     title,
//     coach,
//     cover,
//     rating,
//     ratingsCount,
//     durationWeeks,
//     level,
//     tags,
//     premium,
//     price,
//     compareAtPrice,
//     blurb,
//   } = program;

//   // ---- Safe coercions/fallbacks ----
//   const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 4.9;
//   const safeRatingsCount = typeof ratingsCount === "number" ? ratingsCount : 0;
//   const safeWeeks = Number.isFinite(Number(durationWeeks))
//     ? Number(durationWeeks)
//     : 12;
//   const safeLevel = (level as string) || "Beginner";
//   const safeCover = cover || "/placeholder.png";
//   const { userDB } = useGetUser();

//   const [isLoading, setIsLoading] = useState(false);

//   const [subscribedProgramIds, setSubscribedProgramIds] = useState<string[]>(
//     []
//   );

//   useEffect(() => {
//     const fetchGetProgramsByUserID = async () => {
//       try {
//         setIsLoading(true);
//         const { data } = await axios.get(
//           `https://godzilla-be.vercel.app/api/v1/subscripe/${userDB?.data?.user_id}`
//         );

//         // افترض إن كل subscription فيه program_id
//         const programIds =
//           data?.data?.map((sub: { program_id: string }) => sub.program_id) ||
//           [];
//         setSubscribedProgramIds(programIds);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           console.error("❌ Error fetching programs:", err.message);
//         } else {
//           console.error("❌ Unknown error:", err);
//         }
//         // toast.error("Failed to fetch programs. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (userDB?.data?.user_id) {
//       fetchGetProgramsByUserID();
//     }
//   }, [userDB?.data?.user_id]);

//   const isSubscribed = subscribedProgramIds.includes(program.id);

//   return (
//     <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//       {/* Cover */}
//       <div className="relative h-56 w-full">
//         <img
//           src={safeCover}
//           alt={title || "Program cover"}
//           className="h-full w-full object-cover" // ⬅️ add h-full w-full
//           sizes="(min-width: 1024px) 420px, 100vw"
//         />

//         {/* top-left badge */}
//         {premium && (
//           <span className="absolute left-3 top-3 rounded-full bg-rose-600/90 px-2.5 py-1  font-semibold text-white shadow-sm">
//             Premium
//           </span>
//         )}

//         {/* top-right pricing */}
//         {(price || compareAtPrice) && (
//           <div className="absolute right-3 top-3 grid gap-0.5 text-right">
//             {compareAtPrice && (
//               <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white line-through">
//                 {compareAtPrice}
//               </span>
//             )}
//             {price && (
//               <span className="rounded-full bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
//                 {price}
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="p-4 lg:p-5">
//         <h3 className="text-lg font-semibold">{title}</h3>

//         <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
//           <LuDumbbell className="text-gray-500" />
//           <span>{coach}</span>
//         </div>

//         {/* meta row */}
//         <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
//           <div className="flex items-center gap-1 text-amber-500">
//             <FiStar className="shrink-0" />
//             <span className="font-medium">{safeRating.toFixed(1)}</span>
//             <span className="text-gray-500">({safeRatingsCount})</span>
//           </div>

//           <div className="flex items-center gap-1 text-gray-600">
//             <FiClock className="shrink-0" />
//             <span>{safeWeeks} weeks</span>
//           </div>

//           <div className="flex items-center gap-1 text-gray-600">
//             <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
//             <span>{safeLevel}</span>
//           </div>
//         </div>

//         {/* blurb */}
//         {blurb && (
//           <p className="mt-3 text-sm leading-6 text-gray-700">{blurb}</p>
//         )}

//         {/* chips */}
//         {Array.isArray(tags) && tags.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-2">
//             {tags.map((t) => (
//               <span
//                 key={t}
//                 className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="mt-4 w-full flex items-center gap-3">
//           <Link
//             className="inline-flex w-1/2 cursor-pointer justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
//             href={`/programs/${program.id}`}
//           >
//             <button
//               onClick={() => onPreview?.(program)}
//               // className="inline-flex w-1/2 justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
//             >
//               ▶ Preview
//             </button>
//           </Link>
//           <button

//             disabled={isSubscribed}
//             onClick={() => !isSubscribed && onSubscribe?.(program)}
//             className={`inline-flex w-1/2 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition
//     ${
//       isSubscribed
//         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//         : "bg-rose-600 text-white hover:bg-rose-700"
//     }`}

//           >
//             {isSubscribed ? "Subscribed" : "Subscribe"}
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// // components/shared/ProgramCard.tsx
// "use client";

// import useGetUser from "@/app/Hooks/useGetUser";
// import { createAthleteSubscription } from "@/app/services/subscription.service";
// import axios from "axios";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { FiStar, FiClock } from "react-icons/fi";
// import { LuDumbbell } from "react-icons/lu";
// import { toast } from "react-toastify";

// export type Program = {
//   id: string;
//   title: string;
//   coach: string;
//   cover: string | null | undefined;
//   cover_image_url?: string | null | undefined;
//   rating?: number | string;
//   ratingsCount?: number;
//   durationWeeks?: number | string;
//   level?: "Beginner" | "Intermediate" | "Advanced" | string;
//   tags?: string[];
//   premium?: boolean;
//   price?: string;
//   compareAtPrice?: string;
//   blurb?: string;
//   description?: string;
//   users?: {
//     avatar_url: string;
//     first_name: string;
//     id: string;
//     second_name: string;
//   };
// };

// export default function ProgramCard({
//   program,
//   onPreview,
//   onSubscribe,
// }: {
//   program: Program;
//   onPreview?: (p: Program) => void;
//   onSubscribe?: (p: Program) => void;
// }) {
//   const {
//     title,
//     coach,
//     cover,
//     rating,
//     ratingsCount,
//     durationWeeks,
//     level,
//     tags,
//     premium,
//     price,
//     compareAtPrice,
//     blurb,
//   } = program;

//   const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 4.9;
//   const safeRatingsCount = typeof ratingsCount === "number" ? ratingsCount : 0;
//   const safeWeeks = Number.isFinite(Number(durationWeeks))
//     ? Number(durationWeeks)
//     : 12;
//   const safeLevel = (level as string) || "Beginner";
//   const safeCover = cover || "/placeholder.png";

//   const { userDB } = useGetUser();
//   const [isLoading, setIsLoading] = useState(false);
//   const [subscribedProgramIds, setSubscribedProgramIds] = useState<string[]>(
//     []
//   );

//   // useEffect(() => {
//   //   const fetchGetProgramsByUserID = async () => {
//   //     try {
//   //       setIsLoading(true);
//   //       const { data } = await axios.get(
//   //         `https://godzilla-be.vercel.app/api/v1/subscripe/${userDB?.data?.user_id}`
//   //       );

//   //       const programIds =
//   //         data?.data?.map((sub: { program_id: string }) => sub.program_id) ||
//   //         [];
//   //       setSubscribedProgramIds(programIds);
//   //     } catch (err: unknown) {
//   //       if (err instanceof Error) {
//   //         console.error("❌ Error fetching programs:", err.message);
//   //       } else {
//   //         console.error("❌ Unknown error:", err);
//   //       }
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   if (userDB?.data?.user_id) {
//   //     void fetchGetProgramsByUserID();
//   //   }
//   // }, [userDB?.data?.user_id]);

//   const isSubscribed = subscribedProgramIds.includes(program.id);
//   const hasSubscribe = Boolean(onSubscribe);

//   return (
//     <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//       {/* Cover */}
//       <div className="relative h-56 w-full">
//         <img
//           src={safeCover}
//           alt={title || "Program cover"}
//           className="h-full w-full object-cover"
//           sizes="(min-width: 1024px) 420px, 100vw"
//         />

//         {premium && (
//           <span className="absolute left-3 top-3 rounded-full bg-rose-600/90 px-2.5 py-1 font-semibold text-white shadow-sm">
//             Premium
//           </span>
//         )}

//         {(price || compareAtPrice) && (
//           <div className="absolute right-3 top-3 grid gap-0.5 text-right">
//             {compareAtPrice && (
//               <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white line-through">
//                 {compareAtPrice}
//               </span>
//             )}
//             {price && (
//               <span className="rounded-full bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
//                 {price}
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="p-4 lg:p-5">
//         <h3 className="text-lg font-semibold">{title}</h3>

//         <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
//           <LuDumbbell className="text-gray-500" />
//           <span>{coach}</span>
//         </div>

//         {/* meta row */}
//         <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
//           <div className="flex items-center gap-1 text-amber-500">
//             <FiStar className="shrink-0" />
//             <span className="font-medium">{safeRating.toFixed(1)}</span>
//             <span className="text-gray-500">({safeRatingsCount})</span>
//           </div>

//           <div className="flex items-center gap-1 text-gray-600">
//             <FiClock className="shrink-0" />
//             <span>{safeWeeks} weeks</span>
//           </div>

//           <div className="flex items-center gap-1 text-gray-600">
//             <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
//             <span>{safeLevel}</span>
//           </div>
//         </div>

//         {blurb && (
//           <p className="mt-3 text-sm leading-6 text-gray-700">{blurb}</p>
//         )}

//         {Array.isArray(tags) && tags.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-2">
//             {tags.map((t) => (
//               <span
//                 key={t}
//                 className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="mt-4 w-full flex items-center gap-3">
//           {/* Preview */}
//           <Link
//             href={`/programs/${program.id}`}
//             className={`inline-flex ${
//               hasSubscribe ? "w-1/2" : "w-full"
//             } cursor-pointer justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50`}
//           >
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault(); // don't break the Link
//                 onPreview?.(program);
//               }}
//             >
//               ▶ Preview
//             </button>
//           </Link>

//           {/* Subscribe (only if onSubscribe exists, i.e. not in "mine" tab) */}
//           {hasSubscribe && (
//             <button
//   type="button"
//   disabled={isSubscribed}
//   onClick={() => {
//     if (!isSubscribed) onSubscribe?.(program);
//   }}
//   className={`inline-flex w-1/2 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition
//     ${
//       isSubscribed
//         ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//         : "bg-rose-600 text-white hover:bg-rose-700"
//     }`}
// >
//   {isSubscribed ? "Subscribed" : "Subscribe"}
// </button>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// components/shared/ProgramCard.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiStar, FiClock } from "react-icons/fi";
import { LuDumbbell } from "react-icons/lu";

export type Program = {
  id: string;
  title: string;
  cover: string | null | undefined;
  cover_image_url?: string | null | undefined;
  rating?: number | string;
  ratingsCount?: number;
  durationWeeks?: number | string;
  level?: "Beginner" | "Intermediate" | "Advanced" | string;
  tags?: string[];
  premium?: boolean;
  price?: string;
  compareAtPrice?: string;
  blurb?: string;
  description?: string;
  users?: {
    avatar_url: string;
    first_name: string;
    id: string;
    second_name: string;
  };
  coach?: {
    avatar_url?: string;
    bio?: string;
    created_at?: string;
    date_of_birth?: string;
    email?: string;
    email_verified?: string;
    experience_level?: string;
    first_name?: string;
    id?: string;
    is_active?: string;
    last_login?: string;
    location?: string;
    phone?: string;
    second_name?: string;
    updated_at?: string;
    user_type?: string;
  };
};

export default function ProgramCard({
  program,
  onPreview,
  onSubscribe,
  isSubscribed = false,
}: {
  program: Program;
  onPreview?: (p: Program) => void;
  onSubscribe?: (p: Program) => void;
  isSubscribed?: boolean;
}) {
  const { safeRating, safeRatingsCount, safeWeeks, safeLevel, safeCover } =
    useMemo(() => {
      const r = Number(program.rating);
      const w = Number(program.durationWeeks);

      return {
        safeRating: Number.isFinite(r) ? r : 4.9,
        safeRatingsCount: typeof program.ratingsCount === "number" ? ratingsCount : 0,
        safeWeeks: Number.isFinite(w) ? w : 12,
        safeLevel: (level as string) || "Beginner",
        safeCover: cover || "/placeholder.png",
      };
    }, [rating, ratingsCount, durationWeeks, level, cover]);

  const hasSubscribe = Boolean(onSubscribe);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-56 w-full">
        <img
          src={safeCover}
          alt={title || "Program cover"}
          className="h-full w-full object-cover"
          sizes="(min-width: 1024px) 420px, 100vw"
        />

        {premium && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600/90 px-2.5 py-1 font-semibold text-white shadow-sm">
            Premium
          </span>
        )}

        {(price || compareAtPrice) && (
          <div className="absolute right-3 top-3 grid gap-0.5 text-right">
            {compareAtPrice && (
              <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white line-through">
                {compareAtPrice}
              </span>
            )}
            {price && (
              <span className="rounded-full bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                {price}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 lg:p-5">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <LuDumbbell className="text-gray-500" />
          <span>{coach?.first_name}</span>
        </div>

        {/* meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            <FiStar className="shrink-0" />
            <span className="font-medium">{safeRating.toFixed(1)}</span>
            <span className="text-gray-500">({safeRatingsCount})</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <FiClock className="shrink-0" />
            <span>{safeWeeks} weeks</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
            <span>{safeLevel}</span>
          </div>
        </div>

        {blurb && (
          <p className="mt-3 text-sm leading-6 text-gray-700">{blurb}</p>
        )}

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 w-full flex items-center gap-3">
          {/* Preview */}
          <Link
            href={`/programs/${program.id}`}
            className={`inline-flex ${
              hasSubscribe ? "w-1/2" : "w-full"
            } cursor-pointer justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault(); // don't break the Link
                onPreview?.(program);
              }}
            >
              ▶ Preview
            </button>
          </Link>

          {/* Subscribe (uses isSubscribed prop) */}
          {hasSubscribe && (
            <button
              type="button"
              disabled={isSubscribed}
              onClick={() => {
                if (!isSubscribed) onSubscribe?.(program);
              }}
              className={`inline-flex w-1/2 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition
                ${
                  isSubscribed
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
