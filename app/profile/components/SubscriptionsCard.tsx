"use client";
type Subscription = {
  id: string | number;
  program_title: string;
  coach_name?: string;
  status?: "active" | "paused" | "expired";
};

export default function SubscriptionsList({
  loading,
  items,
}: {
  loading: boolean;
  items: Subscription[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 font-medium">Active Subscriptions</div>
      <div className="space-y-3">
        {loading ? (
          <>
            <div className="h-12 animate-pulse rounded-xl bg-zinc-200" />
            <div className="h-12 animate-pulse rounded-xl bg-zinc-200" />
          </>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-500">No active subscriptions.</div>
        ) : (
          items.map((s) => (
            <div
              key={String(s.id)}
              className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-3"
            >
              <div>
                <div className="text-sm font-medium">{s.program_title}</div>
                {s.coach_name && (
                  <div className="text-xs text-zinc-500">by {s.coach_name}</div>
                )}
              </div>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-medium ring-1",
                  s.status === "active"
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : s.status === "paused"
                    ? "bg-amber-50 text-amber-700 ring-amber-200"
                    : "bg-zinc-100 text-zinc-600 ring-zinc-200",
                ].join(" ")}
              >
                {s.status ?? "active"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
