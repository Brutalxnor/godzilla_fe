// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import axios, { AxiosError } from "axios";
// // import { TrendingUp, BookOpen, Award, Flame } from "lucide-react";
// // import RecentAchievements from "./components/AchievementsCard";
// // import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
// // import StatCard from "./components/StatGrid";
// // import SubscriptionsList from "./components/SubscriptionsCard";
// // import Sidebar from "../components/shared/sidebar";
// // import useGetUser from "../Hooks/useGetUser";


// // /* ===== types for this page ===== */
// // type UserLocal = { data?: { user_id?: string | number; token?: string; name?: string; email?: string } };
// // type ProgramLite = { id: string | number; title: string };
// // type Achievement = { id: string | number; title: string; date?: string; emoji?: string };
// // type Subscription = { id: string | number; program_title: string; coach_name?: string; status?: "active" | "paused" | "expired" };

// // type ProfileData = {
// //   user: ProfileCore;
// //   stats: { workouts: number; programs: number; achievements: number; day_streak: number };
// //   achievements: Achievement[];
// //   subscriptions: Subscription[];
// // };

// // /* ===== config ===== */
// // const API_BASE = (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "https://godzilla-be.vercel.app/api/v1");
// // const endpoints = {
// //   user: (id: string | number) => `${API_BASE}/users/${id}`,
// //   programs: (id: string | number) => `${API_BASE}/programs/${id}`,
// //   achievements: (id: string | number) => `${API_BASE}/achievements/${id}`,
// //   subscriptions: (id: string | number) => `${API_BASE}/subscriptions/${id}`,
// // };

// // export default function ProfilePage() {
// //   const [data, setData] = useState<ProfileData | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [tab, setTab] = useState<"overview" | "activity" | "settings">("overview");
// //   const [error, setError] = useState<string | null>(null);
// //   const {userDB} = useGetUser();

// //   const authHeaders = useMemo(() => {
// //     const raw = localStorage.getItem("user");
// //     let token: string | undefined;
// //     try { token = (raw ? JSON.parse(raw) : null)?.data?.token; } catch {}
// //     return token ? { Authorization: `Bearer ${token}` } : {};
// //   }, []);

// //   const shellVars = {
// //     "--sb-w": "88px",
// //     "--extra-left": "24px",
// //   } as React.CSSProperties;

// //   useEffect(() => {
// //     let cancelled = false;

// //     async function load() {
// //       setLoading(true); setError(null);
// //       try {
// //         const raw = localStorage.getItem("user");
// //         if (!raw) throw new Error("User not found in localStorage.");
// //         const u: UserLocal = JSON.parse(raw);
// //         const userId = u?.data?.user_id;
// //         if (!userId) throw new Error("Missing user_id in localStorage.");

// //         const [userRes, progRes, achRes, subRes] = await Promise.all([
// //           axios.get(endpoints.user(userId), { headers: authHeaders }).catch(() => ({ data: null })),
// //           axios.get(endpoints.programs(userId), { headers: authHeaders }).catch(() => ({ data: [] })),
// //           axios.get(endpoints.achievements(userId), { headers: authHeaders }).catch(() => ({ data: [] })),
// //           axios.get(endpoints.subscriptions(userId), { headers: authHeaders }).catch(() => ({ data: [] })),
// //         ]);

// //         const user: ProfileCore =
// //           userRes?.data?.data || userRes?.data || {
// //             id: userId,
// //             name: userDB?.data.user.first_name || "User",
// //             email: u?.data?.email || "",
// //             location: null,
// //             joined_at: null,
// //             avatar_url: null,
// //             goals: null,
// //             experience: null,
// //           };

// //         const programs: ProgramLite[] = progRes?.data?.data || progRes?.data || [];
// //         const achievements: Achievement[] = achRes?.data?.data || achRes?.data || [];
// //         const subscriptions: Subscription[] = subRes?.data?.data || subRes?.data || [];

        
        

// //         const workoutsCount = userRes?.data?.stats?.workouts ?? userRes?.data?.data?.stats?.workouts ?? 0;
// //         const dayStreak = userRes?.data?.stats?.day_streak ?? userRes?.data?.data?.stats?.day_streak ?? 0;

// //         const packed: ProfileData = {
// //           user: {
// //             id: user.id,
// //             name: user.name,
// //             email: user.email,
// //             location: user.location ?? "San Francisco, CA",
// //             joined_at: user.joined_at ?? new Date().toISOString(),
// //             avatar_url: user.avatar_url ?? null,
// //             goals: user.goals ?? "Build muscle, improve strength",
// //             experience: user.experience ?? "Intermediate",
// //           },
// //           stats: {
// //             workouts: Number(workoutsCount) || 0,
// //             programs: Array.isArray(programs) ? programs.length : 0,
// //             achievements: Array.isArray(achievements) ? achievements.length : 0,
// //             day_streak: Number(dayStreak) || 0,
// //           },
// //           achievements: achievements.slice(0, 3).map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
// //           subscriptions: subscriptions.map((s) => ({ ...s, status: s.status ?? "active" })),
// //         };

// //         if (!cancelled) setData(packed);
// //       } catch (e) {
// //         const msg = (e as AxiosError)?.message || (e as Error)?.message || "Failed to load profile.";
// //         if (!cancelled) setError(msg);
// //       } finally { if (!cancelled) setLoading(false); }
// //     }

// //     load();
// //     return () => { cancelled = true; };
// //   }, [authHeaders]);

// //   return (

// //     <div className="min-h-screen bg-[#f7f7f7]">
// //       <Sidebar />
// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
// //       ></main>
// //       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //           <div className="mx-auto max-w-6xl px-7 pb-24">
// //                 <header className="py-4">
// //                     <h1 className="text-4xl font-semibold">Profile</h1>
// //                 </header>

             

// //       <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
// //         {loading ? <div className="h-28 animate-pulse rounded-xl bg-zinc-200" /> :
// //          data ? <ProfileHeader data={data.user} /> :
// //          <div className="text-sm text-red-600">{error}</div>}
// //       </section>

// //       <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
// //         <StatCard loading={loading} icon={<TrendingUp className="h-5 w-5 text-red-600" />} value={data?.stats.workouts ?? 0} label="Workouts" />
// //         <StatCard loading={loading} icon={<BookOpen className="h-5 w-5 text-red-600" />} value={data?.stats.programs ?? 0} label="Programs" />
// //         <StatCard loading={loading} icon={<Award className="h-5 w-5 text-red-600" />} value={data?.stats.achievements ?? 0} label="Achievements" />
// //         <StatCard loading={loading} icon={<Flame className="h-5 w-5 text-red-600" />} value={data?.stats.day_streak ?? 0} label="Day Streak" />
// //       </section>

// //       {/* simple segmented tabs */}
// //       <section className="mt-5">
// //         <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
// //           <button onClick={() => setTab("overview")} className={`flex-1 rounded-full px-4 py-2 ${tab === "overview" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Overview</button>
// //           <button onClick={() => setTab("activity")} className={`flex-1 rounded-full px-4 py-2 ${tab === "activity" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Activity</button>
// //           <button onClick={() => setTab("settings")} className={`flex-1 rounded-full px-4 py-2 ${tab === "settings" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Settings</button>
// //         </div>

// //         <div className="mt-4 space-y-4">
// //           {tab === "overview" && (
// //             <>
// //               <SubscriptionsList loading={loading} items={data?.subscriptions ?? []} />
// //               <RecentAchievements loading={loading} items={data?.achievements ?? []} />
// //             </>
// //           )}
// //           {tab === "activity" && (
// //             <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //               Activity feed coming soon.
// //             </div>
// //           )}
// //           {tab === "settings" && (
// //             <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //               Settings UI coming soon.
// //             </div>
// //           )}
// //         </div>
// //       </section>
// //       </div>
// //     </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { TrendingUp, BookOpen, Award, Flame } from "lucide-react";
// import RecentAchievements from "./components/AchievementsCard";
// import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
// import StatCard from "./components/StatGrid";
// import SubscriptionsList from "./components/SubscriptionsCard";
// import Sidebar from "../components/shared/sidebar";
// import useGetUser from "../Hooks/useGetUser";

// /* ===== strict types matching userDB ===== */
// type ProgramLite = { id: string | number; title: string };
// type Achievement = { id: string | number; title: string; date?: string; emoji?: string };
// type Subscription = {
//   id: string | number;
//   program_title: string;
//   coach_name?: string;
//   status?: "active" | "paused" | "expired";
// };

// type UserDBUser = {
//   id?: string | number;
//   user_id?: string | number;
//   first_name?: string;
//   user_type?: string;
//   last_name?: string;
//   name?: string;
//   email?: string;
//   location?: string | null;
//   joined_at?: string | null;
//   created_at?: string | null;
//   avatar_url?: string | null;
//   goals?: string | null;
//   experience?: string | null;
//   stats?: { workouts?: number; day_streak?: number };
// };

// type UserDBData = {
//   user: UserDBUser;
//   email?: string; // if you keep a flat email too
//   programs?: ProgramLite[];
//   achievements?: Achievement[];
//   subscriptions?: Subscription[];
//   stats?: { workouts?: number; day_streak?: number };
// };

// type UserDBShape = { data: UserDBData };

// type ProfileData = {
//   user: ProfileCore;
//   stats: { workouts: number; programs: number; achievements: number; day_streak: number };
//   achievements: Achievement[];
//   subscriptions: Subscription[];
// };

// export default function ProfilePage() {
//   const [data, setData] = useState<ProfileData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState<"overview" | "activity" | "settings">("overview");
//   const [error, setError] = useState<string | null>(null);

//   const { userDB } = useGetUser(); // must return { data: ... }

//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!userDB || !("data" in userDB)) {
//         setLoading(false);
//         setError("userDB is not ready.");
//         return;
//       }

//       const db = userDB as UserDBShape; // typed alias for clarity
//       const d: UserDBData = db.data;

//       // —— USER FIELDS DIRECTLY FROM userDB.data.*
//       const u: UserDBUser = d.user ?? {};

//       // prefer userDB.data.user.email, fall back to userDB.data.email if you also store it flat
//       const email: string = u.email ?? d.email ?? "";

//       const firstName = u.first_name ?? "";
//       const lastName = u.last_name ?? "";
//       const combined = `${firstName} ${lastName}`.trim();
//       console.log(u.user_type)

//       const profile: ProfileCore = {
//         id: u.id ?? u.user_id ?? "me",
//         name: combined.length > 0 ? combined : u.name ?? email.split("@")[0] ?? "User",
//         email,
//         location: u.location ?? null,
//         joined_at: u.joined_at ?? u.created_at ?? null,
//         avatar_url: u.avatar_url ?? null,
//         goals: u.goals ?? null,
//         experience: u.experience ?? null,
//       };

//       // —— COLLECTIONS DIRECTLY FROM userDB.data.*
//       const programs: ProgramLite[] = Array.isArray(d.programs) ? d.programs : [];
//       const achievements: Achievement[] = Array.isArray(d.achievements) ? d.achievements : [];
//       const subscriptions: Subscription[] = Array.isArray(d.subscriptions) ? d.subscriptions : [];

//       // —— STATS DIRECTLY FROM userDB.data.stats OR userDB.data.user.stats
//       const workouts = Number(d.stats?.workouts ?? u.stats?.workouts ?? 0) || 0;
//       const dayStreak = Number(d.stats?.day_streak ?? u.stats?.day_streak ?? 0) || 0;

//       const packed: ProfileData = {
//         user: {
//           ...profile,
//           // optional friendly defaults for UI only
//           location: profile.location ?? "San Francisco, CA",
//           joined_at: profile.joined_at ?? new Date().toISOString(),
//           goals: profile.goals ?? "Build muscle, improve strength",
//           experience: profile.experience ?? "Intermediate",
//         },
//         stats: {
//           workouts,
//           programs: programs.length,
//           achievements: achievements.length,
//           day_streak: dayStreak,
//         },
//         achievements: achievements.slice(0, 3).map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
//         subscriptions: subscriptions.map((s) => ({
//           ...s,
//           status: s.status ?? "active",
//         })),
//       };

//       setData(packed);
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to build profile from userDB.");
//     } finally {
//       setLoading(false);
//     }
//   }, [userDB]);

//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <Sidebar />
//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
//       ></main>

//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//         <div className="mx-auto max-w-6xl px-7 pb-24">
//           <header className="py-4">
//             <h1 className="text-4xl font-semibold">Profile</h1>
//           </header>

//           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
//             {loading ? (
//               <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
//             ) : data ? (
//               <ProfileHeader data={data.user} />
//             ) : (
//               <div className="text-sm text-red-600">{error}</div>
//             )}
//           </section>

//           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
//             <StatCard
//               loading={loading}
//               icon={<TrendingUp className="h-5 w-5 text-red-600" />}
//               value={data?.stats.workouts ?? 0}
//               label="Workouts"
//             />
//             <StatCard
//               loading={loading}
//               icon={<BookOpen className="h-5 w-5 text-red-600" />}
//               value={data?.stats.programs ?? 0}
//               label="Programs"
//             />
//             <StatCard
//               loading={loading}
//               icon={<Award className="h-5 w-5 text-red-600" />}
//               value={data?.stats.achievements ?? 0}
//               label="Achievements"
//             />
//             <StatCard
//               loading={loading}
//               icon={<Flame className="h-5 w-5 text-red-600" />}
//               value={data?.stats.day_streak ?? 0}
//               label="Day Streak"
//             />
//           </section>

//           {/* simple segmented tabs */}
//           <section className="mt-5">
//             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
//               <button
//                 onClick={() => setTab("overview")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "overview" ? "bg-white shadow text-zinc-900" : "text-zinc-600"
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setTab("activity")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "activity" ? "bg-white shadow text-zinc-900" : "text-zinc-600"
//                 }`}
//               >
//                 Activity
//               </button>
//               <button
//                 onClick={() => setTab("settings")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "settings" ? "bg-white shadow text-zinc-900" : "text-zinc-600"
//                 }`}
//               >
//                 Settings
//               </button>
//             </div>

//             <div className="mt-4 space-y-4">
//               {tab === "overview" && (
//                 <>
//                   <SubscriptionsList loading={loading} items={data?.subscriptions ?? []} />
//                   <RecentAchievements loading={loading} items={data?.achievements ?? []} />
//                 </>
//               )}
//               {tab === "activity" && (
//                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
//                   Activity feed coming soon.
//                 </div>
//               )}
//               {tab === "settings" && (
//                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
//                   Settings UI coming soon.
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TrendingUp, BookOpen, Award, Flame, Users, DollarSign, Star } from "lucide-react";

import RecentAchievements from "./components/AchievementsCard";
import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
import StatCard from "./components/StatGrid";
import SubscriptionsList from "./components/SubscriptionsCard";
import Sidebar from "../components/shared/sidebar";
import useGetUser from "../Hooks/useGetUser";

/* coach components */
import CoachHeader, { CoachProfileCore } from "./components/CoachHeader";
import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";

/* ===== strict types ===== */
type ProgramLite = { id: string | number; title: string };
type Achievement = { id: string | number; title: string; date?: string; emoji?: string };
type Subscription = {
  id: string | number;
  program_title: string;
  coach_name?: string;
  status?: "active" | "paused" | "expired";
};

/** this matches the shape you reported in the error */
type UserDBUser = {
  first_name: string;
  second_name: string;                 // instead of last_name
  user_type: "coach" | "athlete" | string;
  location: string;
  phone: string;
  date_of_birth: string;
  last_login: string;
  experience_level: string;            // re-used as "bio"
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
  email?: string;                      // if you store it at the root
  user_id?: string | number;           // optional root fallback id

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
  stats: { workouts: number; programs: number; achievements: number; day_streak: number };
  achievements: Achievement[];
  subscriptions: Subscription[];
};

type CoachVM = {
  header: CoachProfileCore;
  stats: { subscribers: number; programs: number; rating: number; monthly: number };
  programs: CoachProgramItem[];
  certs: CertificationItem[];
};

/* ===== API config & helper ===== */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as string | undefined) ??
  "http://127.0.0.1:4000/api/v1";

type ProgramFromAPI = { id: string | number; title: string; subscribers?: number; rating?: number };

async function fetchProgramsByCoachId(
  coachId: string | number,
  token?: string
): Promise<ProgramFromAPI[]> {
  const url = `${API_BASE}/programs/programCoach/${coachId}`;
  const res = await axios.get(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
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
        .map((seg) => (seg === "-" || seg === "'" ? seg : seg ? seg[0].toUpperCase() + seg.slice(1).toLowerCase() : seg))
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
  const [tab, setTab] = useState<"overview" | "activity" | "settings">("overview");
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
      const rawFullName = `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() || email.split("@")[0] || "User";
      const fullName = toTitleCase(rawFullName);

      if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
        const header: CoachProfileCore = {
          id: resolveUserId(d) ?? "me",
          name: fullName,
          email,
          location: u.location || null,
          joined_at: null,      // not present in your shape
          avatar_url: null,     // not present in your shape
          bio: u.experience_level || null,
          tags: [],             // fill if available
        };

        const coachBlock: CoachBlock = d.coach ?? {};
        const seededPrograms: CoachProgramItem[] = Array.isArray(coachBlock.programs) ? coachBlock.programs : [];
        const certs: CertificationItem[] = Array.isArray(coachBlock.certifications) ? coachBlock.certifications : [];

        const vm: CoachVM = {
          header,
          stats: {
            subscribers: coachBlock.subscribers ?? 0,
            programs: seededPrograms.length,      // will be updated after API call
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

        const programs: ProgramLite[] = Array.isArray(d.programs) ? d.programs : [];
        const achievements: Achievement[] = Array.isArray(d.achievements) ? d.achievements : [];
        const subscriptions: Subscription[] = Array.isArray(d.subscriptions) ? d.subscriptions : [];

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
          achievements: achievements.slice(0, 3).map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
          subscriptions: subscriptions.map((s) => ({ ...s, status: s.status ?? "active" })),
        };

        setAthleteVM(vm);
        setCoachVM(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to build profile from userDB.");
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
            ? { ...prev, stats: { ...prev.stats, programs: mapped.length }, programs: mapped }
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

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar />
      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
      ></main>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-7 pb-24">
          <header className="py-4">
            <h1 className="text-4xl font-semibold">Profile</h1>
          </header>

          {/* header card */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            {showLoading ? (
              <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
            ) : error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : isCoach && coachVM ? (
              <CoachHeader data={coachVM.header} />
            ) : athleteVM ? (
              <ProfileHeader data={athleteVM.user} />
            ) : null}
          </section>

          {/* stats row */}
          <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {isCoach && coachVM ? (
              <>
                <StatCard loading={showLoading} icon={<Users className="h-5 w-5 text-red-600" />} value={coachVM.stats.subscribers} label="Subscribers" />
                <StatCard loading={showLoading} icon={<BookOpen className="h-5 w-5 text-red-600" />} value={coachVM.stats.programs} label="Programs" />
                <StatCard loading={showLoading} icon={<Star className="h-5 w-5 text-red-600" />} value={coachVM.stats.rating} label="Rating" />
                <StatCard loading={showLoading} icon={<DollarSign className="h-5 w-5 text-red-600" />} value={coachVM.stats.monthly} label="Monthly" />
              </>
            ) : athleteVM ? (
              <>
                <StatCard loading={showLoading} icon={<TrendingUp className="h-5 w-5 text-red-600" />} value={athleteVM.stats.workouts} label="Workouts" />
                <StatCard loading={showLoading} icon={<BookOpen className="h-5 w-5 text-red-600" />} value={athleteVM.stats.programs} label="Programs" />
                <StatCard loading={showLoading} icon={<Award className="h-5 w-5 text-red-600" />} value={athleteVM.stats.achievements} label="Achievements" />
                <StatCard loading={showLoading} icon={<Flame className="h-5 w-5 text-red-600" />} value={athleteVM.stats.day_streak} label="Day Streak" />
              </>
            ) : null}
          </section>

          {/* tabs */}
          <section className="mt-5">
            <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
              <button onClick={() => setTab("overview")} className={`flex-1 rounded-full px-4 py-2 ${tab === "overview" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Overview</button>
              <button onClick={() => setTab("activity")} className={`flex-1 rounded-full px-4 py-2 ${tab === "activity" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Activity</button>
              <button onClick={() => setTab("settings")} className={`flex-1 rounded-full px-4 py-2 ${tab === "settings" ? "bg-white shadow text-zinc-900" : "text-zinc-600"}`}>Settings</button>
            </div>

            <div className="mt-4 space-y-4">
              {tab === "overview" &&
                (isCoach && coachVM ? (
                  <>
                    <CoachProgramsList loading={showLoading} items={coachVM.programs} />
                    <CoachCertifications loading={showLoading} items={coachVM.certs} />
                  </>
                ) : athleteVM ? (
                  <>
                    <SubscriptionsList loading={showLoading} items={athleteVM.subscriptions} />
                    <RecentAchievements loading={showLoading} items={athleteVM.achievements} />
                  </>
                ) : null)}

              {tab === "activity" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">Activity feed coming soon.</div>
              )}
              {tab === "settings" && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">Settings UI coming soon.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
