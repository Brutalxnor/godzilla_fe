"use client";
export default function StatCard({
  icon,
  value,
  label,
  loading,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm">
      {loading ? (
        <div className="space-y-2">
          <div className="mx-auto h-5 w-5 animate-pulse rounded bg-zinc-200" />
          <div className="mx-auto h-7 w-8 animate-pulse rounded bg-zinc-200" />
          <div className="mx-auto h-3 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
      ) : (
        <>
          <div className="mx-auto mb-2">{icon}</div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs text-zinc-500">{label}</div>
        </>
      )}
    </div>
  );
}
