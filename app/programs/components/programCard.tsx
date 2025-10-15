// components/shared/ProgramCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiStar, FiClock } from "react-icons/fi";
import { LuDumbbell } from "react-icons/lu";

export type Program = {
  id: string;
  title: string;
  coach: string;
  cover: string | null | undefined; // allow nulls from API
  cover_image_url?: string | null | undefined; // allow nulls from API
  rating?: number | string; // allow string/undefined
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
};

export default function ProgramCard({
  program,
  onPreview,
  onSubscribe,
}: {
  program: Program;
  onPreview?: (p: Program) => void;
  onSubscribe?: (p: Program) => void;
}) {
  const {
    title,
    coach,
    cover,
    rating,
    ratingsCount,
    durationWeeks,
    level,
    tags,
    premium,
    price,
    compareAtPrice,
    blurb,
  } = program;

  // ---- Safe coercions/fallbacks ----
  const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 4.9;
  const safeRatingsCount = typeof ratingsCount === "number" ? ratingsCount : 0;
  const safeWeeks = Number.isFinite(Number(durationWeeks))
    ? Number(durationWeeks)
    : 12;
  const safeLevel = (level as string) || "Beginner";
  const safeCover = cover || "/placeholder.png";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover */}
      <div className="relative h-56 w-full">
        <img
          src={safeCover}
          alt={title || "Program cover"}
          className="h-full w-full object-cover" // ⬅️ add h-full w-full
          sizes="(min-width: 1024px) 420px, 100vw"
        />

        {/* top-left badge */}
        {premium && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            premium
          </span>
        )}

        {/* top-right pricing */}
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
          <span>{coach}</span>
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

        {/* blurb */}
        {blurb && (
          <p className="mt-3 text-sm leading-6 text-gray-700">{blurb}</p>
        )}

        {/* chips */}
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
          <Link
            className="inline-flex w-1/2 cursor-pointer justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            href={`/programs/${program.id}`} 
          >
            <button
              onClick={() => onPreview?.(program)}
              // className="inline-flex w-1/2 justify-center items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              ▶ Preview
            </button>
          </Link>
          <button
            onClick={() => onSubscribe?.(program)}
            className="inline-flex w-1/2 cursor-pointer items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Subscribe
          </button>
        </div>
      </div>
    </article>
  );
}
