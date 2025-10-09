"use client";
type Achievement = {
  id: string | number;
  title: string;
  date?: string; // ISO
  emoji?: string;
};

export default function RecentAchievements({
  loading,
  items,
}: {
  loading: boolean;
  items: Achievement[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 font-medium">Recent Achievements</div>
      <div className="space-y-3">
        {loading ? (
          <>
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
            <div className="h-14 animate-pulse rounded-xl bg-zinc-200" />
          </>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-500">No achievements yet.</div>
        ) : (
          items.map((a) => (
            <div
              key={String(a.id)}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-3"
            >
              <span className="text-xl">{a.emoji ?? "🏅"}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{a.title}</div>
                {a.date && (
                  <div className="text-xs text-zinc-500">
                    {new Date(a.date).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
