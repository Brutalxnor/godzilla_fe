"use client";
import { Mail, MapPin, CalendarDays, Edit3 } from "lucide-react";

export type CoachProfileCore = {
  id: string | number;
  name: string;
  email: string;
  location?: string | null;
  joined_at?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  tags?: string[]; // e.g., ["Strength Training", "Powerlifting", "Nutrition"]
};

function formatMonthYear(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export default function CoachHeader({ data }: { data: CoachProfileCore }) {
  const initials = (data.name || "C").split(/\s+/).map(s => s[0]).slice(0,2).join("");

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-700 overflow-hidden">
        {data.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.avatar_url} alt={data.name} className="h-full w-full object-cover" />
        ) : (
          initials || "C"
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{data.name}</h2>
            <div className="mt-1 flex flex-col gap-1 text-sm text-zinc-600">
              <InfoRow icon={<Mail className="h-4 w-4" />} text={data.email} />
              {data.location && <InfoRow icon={<MapPin className="h-4 w-4" />} text={data.location} />}
              {data.joined_at && (
                <InfoRow icon={<CalendarDays className="h-4 w-4" />} text={`Joined ${formatMonthYear(data.joined_at)}`} />
              )}
            </div>
          </div>

          {/* <button className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <Edit3 className="h-4 w-4" />
            Edit
          </button> */}
        </div>

        {data.bio && <p className="mt-3 text-sm text-zinc-700">{data.bio}</p>}

        {data.tags && data.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.tags.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
