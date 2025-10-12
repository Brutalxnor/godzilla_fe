"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  BookOpen,
  Award,
  Flame,
  Users,
  DollarSign,
  Star,
} from "lucide-react";

import RecentAchievements from "./components/AchievementsCard";
import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
import StatCard from "./components/StatGrid";
import SubscriptionsList from "./components/SubscriptionsCard";
import Sidebar from "../components/shared/sidebar";
import useGetUser from "../Hooks/useGetUser";

/* coach components */
import CoachHeader, { CoachProfileCore } from "./components/CoachHeader";
// import CoachProgramsList, {
//   CoachProgramItem,
// } from "./components/ProgramsListCard";
// import CoachCertifications, {
//   CertificationItem,
// } from "./components/CertificationsCard";
// import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
// import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
import ThemeToggle from "../components/ThemeToggle";
import useGetTheme from "../Hooks/useGetTheme";
import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";

/* ===== strict types ===== */
type ProgramLite = { id: string | number; title: string };
type Achievement = {
  id: string | number;
  title: string;
  date?: string;
  emoji?: string;
};
type Subscription = {
  id: string | number;
  program_title: string;
  coach_name?: string;
  status?: "active" | "paused" | "expired";
};

/** this matches the shape you reported in the error */
type UserDBUser = {
  first_name: string;
  second_name: string; // instead of last_name
  user_type: "coach" | "athlete" | string;
  location: string;
  phone: string;
  date_of_birth: string;
  last_login: string;
  experience_level: string; // re-used as "bio"
  message: string;

  /* IDs the backend may also send */
  user_id?: string | number;
};

type CoachBlock = {
  subscribers?: number;
  monthly_revenue?: number;
  rating?: number;
  certifications?: CertificationItem[];
  programs?: CoachProgramItem[];
};

type UserDBData = {
  user: UserDBUser;
  email?: string; // if you store it at the root
  user_id?: string | number; // optional root fallback id

  /* athlete bits */
  programs?: ProgramLite[];
  achievements?: Achievement[];
  subscriptions?: Subscription[];
  stats?: { workouts?: number; day_streak?: number };

  /* optional coach extras */
  coach?: CoachBlock;
};

type UserDBShape = { data: UserDBData };

/* view models */
type AthleteVM = {
  user: ProfileCore;
  stats: {
    workouts: number;
    programs: number;
    achievements: number;
    day_streak: number;
  };
  achievements: Achievement[];
  subscriptions: Subscription[];
};

type CoachVM = {
  header: CoachProfileCore;
  stats: {
    subscribers: number;
    programs: number;
    rating: number;
    monthly: number;
  };
  programs: CoachProgramItem[];
  certs: CertificationItem[];
};

/* ===== API config & helper ===== */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
    | string
    | undefined) ?? "http://127.0.0.1:4000/api/v1";

type ProgramFromAPI = {
  id: string | number;
  title: string;
  subscribers?: number;
  rating?: number;
};

async function fetchProgramsByCoachId(
  coachId: string | number,
  token?: string
): Promise<ProgramFromAPI[]> {
  const url = `${API_BASE}/programs/programCoach/${coachId}`;
  const res = await axios.get(
    url,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  const raw = res?.data?.data;
  return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
}

/* ===== helpers ===== */
const toTitleCase = (s: string): string =>
  s
    .trim()
    .split(/\s+/)
    .map((part) =>
      part
        .split(/([-'])/)
        .map((seg) =>
          seg === "-" || seg === "'"
            ? seg
            : seg
            ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
            : seg
        )
        .join("")
    )
    .join(" ");

function resolveUserId(d: UserDBData): string | number | undefined {
  return d.user.user_id ?? d.user_id;
}

export default function ProfilePage() {
  const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
  const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
  const [tab, setTab] = useState<"overview" | "activity" | "settings">(
    "overview"
  );
  const [error, setError] = useState<string | null>(null);

  const { userDB } = useGetUser();

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();

  /* build base VMs from userDB */
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      if (!userDB || !("data" in userDB)) {
        setLoading(false);
        setError("userDB is not ready.");
        return;
      }

      const d: UserDBData = (userDB as UserDBShape).data;
      const u: UserDBUser = d.user;

      const email = d.email ?? ""; // adjust if you store email elsewhere
      const rawFullName =
        `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
        email.split("@")[0] ||
        "User";
      const fullName = toTitleCase(rawFullName);

      if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
        const header: CoachProfileCore = {
          id: resolveUserId(d) ?? "me",
          name: fullName,
          email,
          location: u.location || null,
          joined_at: null, // not present in your shape
          avatar_url: null, // not present in your shape
          bio: u.experience_level || null,
          tags: [], // fill if available
        };

        const coachBlock: CoachBlock = d.coach ?? {};
        const seededPrograms: CoachProgramItem[] = Array.isArray(
          coachBlock.programs
        )
          ? coachBlock.programs
          : [];
        const certs: CertificationItem[] = Array.isArray(
          coachBlock.certifications
        )
          ? coachBlock.certifications
          : [];

        const vm: CoachVM = {
          header,
          stats: {
            subscribers: coachBlock.subscribers ?? 0,
            programs: seededPrograms.length, // will be updated after API call
            rating: Number(coachBlock.rating ?? 0),
            monthly: coachBlock.monthly_revenue ?? 0,
          },
          programs: seededPrograms,
          certs,
        };

        setCoachVM(vm);
        setAthleteVM(null);
      } else {
        const profile: ProfileCore = {
          id: resolveUserId(d) ?? "me",
          name: fullName,
          email,
          location: u.location || null,
          joined_at: null,
          avatar_url: null,
          goals: u.experience_level || null, // reuse if desired
          experience: u.experience_level || null,
        };

        const programs: ProgramLite[] = Array.isArray(d.programs)
          ? d.programs
          : [];
        const achievements: Achievement[] = Array.isArray(d.achievements)
          ? d.achievements
          : [];
        const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
          ? d.subscriptions
          : [];

        const workouts = Number(d.stats?.workouts ?? 0) || 0;
        const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

        const vm: AthleteVM = {
          user: {
            ...profile,
            location: profile.location ?? "San Francisco, CA",
            joined_at: new Date().toISOString(),
            goals: profile.goals ?? "Build muscle, improve strength",
            experience: profile.experience ?? "Intermediate",
          },
          stats: {
            workouts,
            programs: programs.length,
            achievements: achievements.length,
            day_streak: dayStreak,
          },
          achievements: achievements
            .slice(0, 3)
            .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
          subscriptions: subscriptions.map((s) => ({
            ...s,
            status: s.status ?? "active",
          })),
        };

        setAthleteVM(vm);
        setCoachVM(null);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to build profile from userDB."
      );
    } finally {
      setLoading(false);
    }
  }, [userDB]);

  /* fetch real programs list/count for COACH */
  useEffect(() => {
    const d = (userDB as UserDBShape | undefined)?.data;
    if (!d) return;

    const isCoach = (d.user.user_type ?? "athlete").toLowerCase() === "coach";
    const coachId = resolveUserId(d);
    if (!isCoach || coachId === undefined) return;

    let cancelled = false;
    (async () => {
      try {
        setFetchingCoachPrograms(true);

        // If you need auth, read token from localStorage or userDB and pass to helper.
        // const token = JSON.parse(localStorage.getItem("user") || "{}")?.data?.access_token as string | undefined;
        const token = undefined;

        const list = await fetchProgramsByCoachId(coachId, token);
        if (cancelled) return;

        const mapped: CoachProgramItem[] = list.map((p) => ({
          id: p.id,
          title: p.title,
          subscribers: p.subscribers ?? 0,
          rating: Number(p.rating ?? 0),
        }));

        setCoachVM((prev) =>
          prev
            ? {
                ...prev,
                stats: { ...prev.stats, programs: mapped.length },
                programs: mapped,
              }
            : prev
        );
      } catch {
        // optional: surface an error toast
      } finally {
        if (!cancelled) setFetchingCoachPrograms(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userDB]);

  const isCoach = role === "coach";
  const showLoading = loading || (isCoach && fetchingCoachPrograms);
  const {theme} = useGetTheme()
  return (
    <div className={`min-h-screen${theme === "dark" ? "bg-black": "bg-white"}`}>
      <Sidebar />
      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      ></main>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-7 pb-24">
          <header className="py-4 flex justify-between items-center">
            <h1 className="text-4xl font-semibold">Profile</h1>
            <ThemeToggle />
          </header>

          {/* header card */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <div>
                {showLoading ? (
                  <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
                ) : error ? (
                  <div className="text-sm text-red-600">{error}</div>
                ) : isCoach && coachVM ? (
                  <CoachHeader data={coachVM.header} />
                ) : athleteVM ? (
                  <ProfileHeader data={athleteVM.user} />
                ) : null}
              </div>

              <div>
                <h1>Logout</h1>
              </div>
            </div>
          </section>

          {/* stats row */}
          <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {isCoach && coachVM ? (
              <>
                <StatCard
                  loading={showLoading}
                  icon={<Users className="h-5 w-5 text-red-600" />}
                  value={coachVM.stats.subscribers}
                  label="Subscribers"
                />
                <StatCard
                  loading={showLoading}
                  icon={<BookOpen className="h-5 w-5 text-red-600" />}
                  value={coachVM.stats.programs}
                  label="Programs"
                />
                <StatCard
                  loading={showLoading}
                  icon={<Star className="h-5 w-5 text-red-600" />}
                  value={coachVM.stats.rating}
                  label="Rating"
                />
                <StatCard
                  loading={showLoading}
                  icon={<DollarSign className="h-5 w-5 text-red-600" />}
                  value={coachVM.stats.monthly}
                  label="Monthly"
                />
              </>
            ) : athleteVM ? (
              <>
                <StatCard
                  loading={showLoading}
                  icon={<TrendingUp className="h-5 w-5 text-red-600" />}
                  value={athleteVM.stats.workouts}
                  label="Workouts"
                />
                <StatCard
                  loading={showLoading}
                  icon={<BookOpen className="h-5 w-5 text-red-600" />}
                  value={athleteVM.stats.programs}
                  label="Programs"
                />
                <StatCard
                  loading={showLoading}
                  icon={<Award className="h-5 w-5 text-red-600" />}
                  value={athleteVM.stats.achievements}
                  label="Achievements"
                />
                <StatCard
                  loading={showLoading}
                  icon={<Flame className="h-5 w-5 text-red-600" />}
                  value={athleteVM.stats.day_streak}
                  label="Day Streak"
                />
              </>
            ) : null}
          </section>

          {/* tabs */}
          <section className="mt-5">
            <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
              <button
                onClick={() => setTab("overview")}
                className={`flex-1 rounded-full px-4 py-2 ${
                  tab === "overview"
                    ? "bg-white shadow text-zinc-900"
                    : "text-zinc-600"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("activity")}
                className={`flex-1 rounded-full px-4 py-2 ${
                  tab === "activity"
                    ? "bg-white shadow text-zinc-900"
                    : "text-zinc-600"
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`flex-1 rounded-full px-4 py-2 ${
                  tab === "settings"
                    ? "bg-white shadow text-zinc-900"
                    : "text-zinc-600"
                }`}
              >
                Settings
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {tab === "overview" &&
                (isCoach && coachVM ? (
                  <>
                    <CoachProgramsList
                      loading={showLoading}
                      items={coachVM.programs}
                    />
                    <CoachCertifications
                      loading={showLoading}
                      items={coachVM.certs}
                    />
                  </>
                ) : athleteVM ? (
                  <>
                    <SubscriptionsList
                      loading={showLoading}
                      items={athleteVM.subscriptions}
                    />
                    <RecentAchievements
                      loading={showLoading}
                      items={athleteVM.achievements}
                    />
                  </>
                ) : null)}

              {tab === "activity" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
                  Activity feed coming soon.
                </div>
              )}
              {tab === "settings" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
                  Settings UI coming soon.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
