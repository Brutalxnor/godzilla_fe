// components/shared/programCard.tsx
import Link from "next/link";
import { ReactNode } from "react";

type BadgeTone = "green" | "red";

export type ProgramCardProps = {
  title: string;
  coach: string;
  percent: number;
  badge?: string;
  badgeTone?: BadgeTone;
  expires: string;
  onContinue?: () => void;
};

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-rose-100">
      <div
        className="h-2.5 rounded-full bg-rose-500 transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
  } as const;
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${map[tone]}`}>
      {children}
    </span>
  );
}

export default function ProgramCard({
  title,
  coach,
  percent,
  badge,
  badgeTone,
  expires,
  onContinue,
}: ProgramCardProps) {
  return (
    <Link href={"/programs"}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs text-gray-500">by {coach}</div>
          </div>
          {badge && badgeTone && <Badge tone={badgeTone}>{badge}</Badge>}
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-600 mb-1">Progress</div>
          <ProgressBar percent={percent} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">{expires}</div>
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 text-white text-sm px-3 py-1.5 hover:bg-rose-500"
          >
            ▶ Continue
          </button>
        </div>
      </div>
    </Link>
  );
}
