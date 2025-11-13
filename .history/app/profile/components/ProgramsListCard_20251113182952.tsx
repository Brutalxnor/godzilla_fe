"use client";
import { Star } from "lucide-react";
import Link from "next/link";

export type CoachProgramItem = {
  id: string | number;
  title: string;
  subscribers: number;
  rating: number; // 0..5
};

export default function CoachProgramsList({
  loading,
  items,
}: {
  loading: boolean;
  items: CoachProgramItem[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 font-medium">Your Programs</div>
      <div className="space-y-3 cursor-pointer">
        {loading ? (
          <>
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
          </>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-500">No programs yet.</div>
        ) : (
          items.map((p) => (
            <Link
              key={String(p.id)}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-3"
            >
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-zinc-500">
                  {p.subscribers} subscribers
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                {p.rating.toFixed(1)}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
