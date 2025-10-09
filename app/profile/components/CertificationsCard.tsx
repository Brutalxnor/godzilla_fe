"use client";

export type CertificationItem = {
  id: string | number;
  name: string;
  issuer?: string;
};

export default function CoachCertifications({
  loading,
  items,
}: {
  loading: boolean;
  items: CertificationItem[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 font-medium">Certifications</div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <span className="h-6 w-28 animate-pulse rounded-full bg-zinc-200" />
          <span className="h-6 w-44 animate-pulse rounded-full bg-zinc-200" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-zinc-500">No certifications added.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((c) => (
            <span
              key={String(c.id)}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200"
              title={c.issuer ? `Issuer: ${c.issuer}` : undefined}
            >
              {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
