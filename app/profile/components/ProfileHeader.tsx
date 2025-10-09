"use client";
import { useMemo } from "react";
import { Mail, MapPin, CalendarDays, Edit3 } from "lucide-react";

export type ProfileCore = {
  id: string | number;
  name: string;
  email: string;
  location?: string | null;
  joined_at?: string | null;
  avatar_url?: string | null;
  goals?: string | null;
  experience?: string | null;
};

function formatMonthYear(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export default function ProfileHeader({ data }: { data: ProfileCore }) {
  const initials = useMemo(() => {
    const parts = (data.name || "").trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }, [data.name]);

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-700">
        {initials || "U"}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{data.name}</h2>
            <div className="mt-1 flex flex-col gap-1 text-sm text-zinc-600">
              <InfoRow icon={<Mail className="h-4 w-4" />} text={data.email} />
              {data.location && (
                <InfoRow icon={<MapPin className="h-4 w-4" />} text={data.location} />
              )}
              {data.joined_at && (
                <InfoRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  text={`Joined ${formatMonthYear(data.joined_at)}`}
                />
              )}
            </div>
          </div>

          {/* <button className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <Edit3 className="h-4 w-4" />
            Edit
          </button> */}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          <KeyVal label="Goals" value={data.goals ?? "-"} />
          <KeyVal label="Experience" value={data.experience ?? "-"} />
        </div>
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

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
