// "use client";

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   TrendingUp,
//   BookOpen,
//   Award,
//   Flame,
//   Users,
//   DollarSign,
//   Star,
// } from "lucide-react";

// import RecentAchievements from "./components/AchievementsCard";
// import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
// import StatCard from "./components/StatGrid";
// import SubscriptionsList from "./components/SubscriptionsCard";
// import Sidebar from "../components/shared/sidebar";
// import useGetUser from "../Hooks/useGetUser";

// /* coach components */
// import CoachHeader, { CoachProfileCore } from "./components/CoachHeader";
// // import CoachProgramsList, {
// //   CoachProgramItem,
// // } from "./components/ProgramsListCard";
// // import CoachCertifications, {
// //   CertificationItem,
// // } from "./components/CertificationsCard";
// // import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
// // import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
// import ThemeToggle from "../components/ThemeToggle";
// import useGetTheme from "../Hooks/useGetTheme";
// import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
// import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
// import { useSearchParams } from "next/navigation"; // ✅ ADDED

// /* ===== strict types ===== */
// type ProgramLite = { id: string | number; title: string };
// type Achievement = {
//   id: string | number;
//   title: string;
//   date?: string;
//   emoji?: string;
// };
// type Subscription = {
//   id: string | number;
//   program_title: string;
//   coach_name?: string;
//   status?: "active" | "paused" | "expired";
// };

// /** this matches the shape you reported in the error */
// type UserDBUser = {
//   first_name: string;
//   second_name: string; // instead of last_name
//   user_type: "coach" | "athlete" | string;
//   location: string;
//   phone: string;
//   date_of_birth: string;
//   last_login: string;
//   experience_level: string; // re-used as "bio"
//   message: string;

//   /* IDs the backend may also send */
//   user_id?: string | number;
// };

// type CoachBlock = {
//   subscribers?: number;
//   monthly_revenue?: number;
//   rating?: number;
//   certifications?: CertificationItem[];
//   programs?: CoachProgramItem[];
// };

// type UserDBData = {
//   user: UserDBUser;
//   email?: string; // if you store it at the root
//   user_id?: string | number; // optional root fallback id

//   /* athlete bits */
//   programs?: ProgramLite[];
//   achievements?: Achievement[];
//   subscriptions?: Subscription[];
//   stats?: { workouts?: number; day_streak?: number };

//   /* optional coach extras */
//   coach?: CoachBlock;
// };

// type UserDBShape = { data: UserDBData };

// /* view models */
// type AthleteVM = {
//   user: ProfileCore;
//   stats: {
//     workouts: number;
//     programs: number;
//     achievements: number;
//     day_streak: number;
//   };
//   achievements: Achievement[];
//   subscriptions: Subscription[];
// };

// type CoachVM = {
//   header: CoachProfileCore;
//   stats: {
//     subscribers: number;
//     programs: number;
//     rating: number;
//     monthly: number;
//   };
//   programs: CoachProgramItem[];
//   certs: CertificationItem[];
// };

// /* ===== API config & helper ===== */
// const API_BASE =
//   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
//     | string
//     | undefined) ?? "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1";

// type ProgramFromAPI = {
//   id: string | number;
//   title: string;
//   subscribers?: number;
//   rating?: number;
// };

// async function fetchProgramsByCoachId(
//   coachId: string | number,
//   token?: string
// ): Promise<ProgramFromAPI[]> {
//   const url = `${API_BASE}/programs/programCoach/${coachId}`;
//   const res = await axios.get(
//     url,
//     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
//   );
//   const raw = res?.data?.data;
//   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// }

// /* ===== helpers ===== */
// const toTitleCase = (s: string): string =>
//   s
//     .trim()
//     .split(/\s+/)
//     .map((part) =>
//       part
//         .split(/([-'])/)
//         .map((seg) =>
//           seg === "-" || seg === "'"
//             ? seg
//             : seg
//             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
//             : seg
//         )
//         .join("")
//     )
//     .join(" ");

// function resolveUserId(d: UserDBData): string | number | undefined {
//   return d.user.user_id ?? d.user_id;
// }

// /* ======= ADDED: minimal API types + fetcher for user_id override ======= */
// type UserFromAPI = {
//   user_id?: string | number;
//   first_name: string;
//   second_name: string;
//   user_type: string; // "coach" or "athlete"
//   location?: string | null;
//   experience_level?: string | null;
//   email?: string | null;
//   avatar_url?: string | null;
// };
// type UserResp = { data?: UserFromAPI };

// async function getUserById(id: string | number): Promise<UserFromAPI | undefined> {
//   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
//   return data?.data;
// }

// const toSafeTitle = (s: string) =>
//   s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
// /* ===================================================================== */

// export default function ProfilePage() {
//   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
//   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
//   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
//     "overview"
//   );
//   const [error, setError] = useState<string | null>(null);

//   const { userDB } = useGetUser();

//   /* === ADDED: read ?user_id= and track viewing-other flag === */
//   const search = useSearchParams();
//   const userIdParam = search.get("user_id");
//   const [viewingOther, setViewingOther] = useState(false);
//   /* ========================================================= */

//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );

//   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();

//   /* ===== ADDED: override when user_id is present (before your original effect) ===== */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!userIdParam) return; // only run when overriding
//       try {
//         setViewingOther(true);
//         setLoading(true);
//         setError(null);

//         const u = await getUserById(userIdParam);
//         if (!u) throw new Error("User not found");

//         const r = (u.user_type ?? "athlete").toLowerCase();

//         if (r === "coach") {
//           const header: CoachProfileCore = {
//             id: u.user_id ?? userIdParam,
//             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "Coach",
//             // Never pass null to avoid your email error; use undefined if missing
//             email: u.email ?? "",
//             location: u.location ?? null,
//             joined_at: null,
//             avatar_url: u.avatar_url ?? null,
//             bio: u.experience_level ?? null,
//             tags: [],
//           };

//           setFetchingCoachPrograms(true);
//           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
//           const mapped: CoachProgramItem[] = list.map((p) => ({
//             id: p.id,
//             title: p.title,
//             subscribers: p.subscribers ?? 0,
//             rating: Number(p.rating ?? 0),
//           }));

//           if (cancelled) return;
//           setCoachVM({
//             header,
//             stats: {
//               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
//               programs: mapped.length,
//               rating:
//                 mapped.length > 0
//                   ? Math.round(
//                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) / mapped.length) * 10
//                     ) / 10
//                   : 0,
//               monthly: 0,
//             },
//             programs: mapped,
//             certs: [],
//           });
//           setAthleteVM(null);
//         } else {
//           const profile: ProfileCore = {
//             id: u.user_id ?? userIdParam,
//             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "User",
//             email: u.email ?? "", // avoid null
//             location: u.location ?? null,
//             joined_at: null,
//             avatar_url: u.avatar_url ?? null,
//             goals: u.experience_level ?? null,
//             experience: u.experience_level ?? null,
//           };

//           if (cancelled) return;
//           setAthleteVM({
//             user: {
//               ...profile,
//               location: profile.location ?? "San Francisco, CA",
//               joined_at: new Date().toISOString(),
//               goals: profile.goals ?? "Build muscle, improve strength",
//               experience: profile.experience ?? "Intermediate",
//             },
//             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
//             achievements: [],
//             subscriptions: [],
//           });
//           setCoachVM(null);
//         }
//       } catch (e) {
//         if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile.");
//       } finally {
//         if (!cancelled) {
//           setFetchingCoachPrograms(false);
//           setLoading(false);
//         }
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [userIdParam]);
//   /* ================================================================================ */

//   /* build base VMs from userDB */
//   useEffect(() => {
//     if (userIdParam) return; // ✅ skip self-build when viewing someone else

//     setLoading(true);
//     setError(null);

//     try {
//       if (!userDB || !("data" in userDB)) {
//         setLoading(false);
//         setError("userDB is not ready.");
//         return;
//       }

//       const d: UserDBData = (userDB as UserDBShape).data;
//       const u: UserDBUser = d.user;

//       const email = d.email ?? ""; // adjust if you store email elsewhere
//       const rawFullName =
//         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
//         email.split("@")[0] ||
//         "User";
//       const fullName = toTitleCase(rawFullName);

//       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
//         const header: CoachProfileCore = {
//           id: resolveUserId(d) ?? "me",
//           name: fullName,
//           email,
//           location: u.location || null,
//           joined_at: null, // not present in your shape
//           avatar_url: null, // not present in your shape
//           bio: u.experience_level || null,
//           tags: [], // fill if available
//         };

//         const coachBlock: CoachBlock = d.coach ?? {};
//         const seededPrograms: CoachProgramItem[] = Array.isArray(
//           coachBlock.programs
//         )
//           ? coachBlock.programs
//           : [];
//         const certs: CertificationItem[] = Array.isArray(
//           coachBlock.certifications
//         )
//           ? coachBlock.certifications
//           : [];

//         const vm: CoachVM = {
//           header,
//           stats: {
//             subscribers: coachBlock.subscribers ?? 0,
//             programs: seededPrograms.length, // will be updated after API call
//             rating: Number(coachBlock.rating ?? 0),
//             monthly: coachBlock.monthly_revenue ?? 0,
//           },
//           programs: seededPrograms,
//           certs,
//         };

//         setCoachVM(vm);
//         setAthleteVM(null);
//       } else {
//         const profile: ProfileCore = {
//           id: resolveUserId(d) ?? "me",
//           name: fullName,
//           email,
//           location: u.location || null,
//           joined_at: null,
//           avatar_url: null,
//           goals: u.experience_level || null, // reuse if desired
//           experience: u.experience_level || null,
//         };

//         const programs: ProgramLite[] = Array.isArray(d.programs)
//           ? d.programs
//           : [];
//         const achievements: Achievement[] = Array.isArray(d.achievements)
//           ? d.achievements
//           : [];
//         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
//           ? d.subscriptions
//           : [];

//         const workouts = Number(d.stats?.workouts ?? 0) || 0;
//         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

//         const vm: AthleteVM = {
//           user: {
//             ...profile,
//             location: profile.location ?? "San Francisco, CA",
//             joined_at: new Date().toISOString(),
//             goals: profile.goals ?? "Build muscle, improve strength",
//             experience: profile.experience ?? "Intermediate",
//           },
//           stats: {
//             workouts,
//             programs: programs.length,
//             achievements: achievements.length,
//             day_streak: dayStreak,
//           },
//           achievements: achievements
//             .slice(0, 3)
//             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
//           subscriptions: subscriptions.map((s) => ({
//             ...s,
//             status: s.status ?? "active",
//           })),
//         };

//         setAthleteVM(vm);
//         setCoachVM(null);
//       }
//     } catch (e) {
//       setError(
//         e instanceof Error ? e.message : "Failed to build profile from userDB."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [userDB, userIdParam]);

//   /* fetch real programs list/count for COACH */
//   useEffect(() => {
//     if (userIdParam) return; // ✅ skip self refresh when viewing someone else

//     const d = (userDB as UserDBShape | undefined)?.data;
//     if (!d) return;

//     const isCoachSelf = (d.user.user_type ?? "athlete").toLowerCase() === "coach";
//     const coachId = resolveUserId(d);
//     if (!isCoachSelf || coachId === undefined) return;

//     let cancelled = false;
//     (async () => {
//       try {
//         setFetchingCoachPrograms(true);

//         // If you need auth, read token from localStorage or userDB and pass to helper.
//         // const token = JSON.parse(localStorage.getItem("user") || "{}")?.data?.access_token as string | undefined;
//         const token = undefined;

//         const list = await fetchProgramsByCoachId(coachId, token);
//         if (cancelled) return;

//         const mapped: CoachProgramItem[] = list.map((p) => ({
//           id: p.id,
//           title: p.title,
//           subscribers: p.subscribers ?? 0,
//           rating: Number(p.rating ?? 0),
//         }));

//         setCoachVM((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 stats: { ...prev.stats, programs: mapped.length },
//                 programs: mapped,
//               }
//             : prev
//         );
//       } catch {
//         // optional: surface an error toast
//       } finally {
//         if (!cancelled) setFetchingCoachPrograms(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [userDB, userIdParam]);

//   const isCoach = role === "coach";
//   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach; // ✅ ADDED
//   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
//   const {theme} = useGetTheme()
//   return (
//     <div className={`min-h-screen${theme === "dark" ? "bg-black": "bg-white"}`}>
//       <Sidebar />
//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//       ></main>

//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//         <div className="mx-auto max-w-6xl px-7 pb-24">
//           <header className="py-4 flex justify-between items-center">
//             <h1 className="text-4xl font-semibold">Profile</h1>
//             <ThemeToggle />
//           </header>

//           {/* header card */}
//           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
//             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8  justify-between items-center mr-5">
//               <div>
//                 {showLoading ? (
//                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
//                 ) : error ? (
//                   <div className="text-sm text-red-600">{error}</div>
//                 ) : displayCoach && coachVM ? (  /* ✅ use displayCoach */
//                   <CoachHeader data={coachVM.header} />
//                 ) : athleteVM ? (
//                   <ProfileHeader data={athleteVM.user} />
//                 ) : null}
//               </div>

//               <div>
//                 {!viewingOther && (  /* ✅ hide logout when viewing other */
//                   <button
//                     className="bg-gradient-to-r  from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     onClick={() => {
//                       window.location.href = "/";
//                       window.localStorage.removeItem("token");
//                       window.localStorage.removeItem("user");
//                     }}
//                   >
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* stats row */}
//           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
//             {displayCoach && coachVM ? (   /* ✅ use displayCoach */
//               <>
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Users className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.subscribers}
//                   label="Subscribers"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.programs}
//                   label="Programs"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Star className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.rating}
//                   label="Rating"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.monthly}
//                   label="Monthly"
//                 />
//               </>
//             ) : athleteVM ? (
//               <>
//                 <StatCard
//                   loading={showLoading}
//                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.workouts}
//                   label="Workouts"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.programs}
//                   label="Programs"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Award className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.achievements}
//                   label="Achievements"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Flame className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.day_streak}
//                   label="Day Streak"
//                 />
//               </>
//             ) : null}
//           </section>

//           {/* tabs */}
//           <section className="mt-5">
//             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
//               <button
//                 onClick={() => setTab("overview")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "overview"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setTab("activity")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "activity"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Activity
//               </button>
//               <button
//                 onClick={() => setTab("settings")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "settings"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Settings
//               </button>
//             </div>

//             <div className="mt-4 space-y-4">
//               {tab === "overview" &&
//                 (displayCoach && coachVM ? (   /* ✅ use displayCoach */
//                   <>
//                     <CoachProgramsList
//                       loading={showLoading}
//                       items={coachVM.programs}
//                     />
//                     <CoachCertifications
//                       loading={showLoading}
//                       items={coachVM.certs}
//                     />
//                   </>
//                 ) : athleteVM ? (
//                   <>
//                     <SubscriptionsList
//                       loading={showLoading}
//                       items={athleteVM.subscriptions}
//                     />
//                     <RecentAchievements
//                       loading={showLoading}
//                       items={athleteVM.achievements}
//                     />
//                   </>
//                 ) : null)}

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

// "use client";

// import { Suspense, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   TrendingUp,
//   BookOpen,
//   Award,
//   Flame,
//   Users,
//   DollarSign,
//   Star,
// } from "lucide-react";

// import { useSearchParams, useRouter } from "next/navigation"; // ✅ added useRouter
// import ThemeToggle from "@/app/components/ThemeToggle";
// import useGetTheme from "@/app/Hooks/useGetTheme";
// import useGetUser from "@/app/Hooks/useGetUser";
// import RecentAchievements from "./AchievementsCard";
// import CoachCertifications, { CertificationItem } from "./CertificationsCard";
// import CoachHeader, { CoachProfileCore } from "./CoachHeader";
// import ProfileHeader, { ProfileCore } from "./ProfileHeader";
// import CoachProgramsList, { CoachProgramItem } from "./ProgramsListCard";
// import StatCard from "./StatGrid";
// import SubscriptionsList from "./SubscriptionsCard";
// import Sidebar from "@/app/components/shared/sidebar";

// /* ===== strict types ===== */
// type ProgramLite = { id: string | number; title: string };
// type Achievement = {
//   id: string | number;
//   title: string;
//   date?: string;
//   emoji?: string;
// };
// type Subscription = {
//   id: string | number;
//   program_title: string;
//   coach_name?: string;
//   status?: "active" | "paused" | "expired";
// };

// /** this matches the shape you reported in the error */
// type UserDBUser = {
//   first_name: string;
//   second_name: string; // instead of last_name
//   user_type: "coach" | "athlete" | string;
//   location: string;
//   phone: string;
//   date_of_birth: string;
//   last_login: string;
//   experience_level: string; // re-used as "bio"
//   message: string;
//   avatar_url?: string;

//   /* IDs the backend may also send */
//   user_id?: string | number;
// };

// type CoachBlock = {
//   subscribers?: number;
//   monthly_revenue?: number;
//   rating?: number;
//   certifications?: CertificationItem[];
//   programs?: CoachProgramItem[];
// };

// type UserDBData = {
//   user: UserDBUser;
//   email?: string; // if you store it at the root
//   user_id?: string | number; // optional root fallback id

//   /* athlete bits */
//   programs?: ProgramLite[];
//   achievements?: Achievement[];
//   subscriptions?: Subscription[];
//   stats?: { workouts?: number; day_streak?: number };

//   /* optional coach extras */
//   coach?: CoachBlock;
// };

// type UserDBShape = { data: UserDBData };

// /* view models */
// type AthleteVM = {
//   user: ProfileCore;
//   stats: {
//     workouts: number;
//     programs: number;
//     achievements: number;
//     day_streak: number;
//   };
//   achievements: Achievement[];
//   subscriptions: Subscription[];
// };

// type CoachVM = {
//   header: CoachProfileCore;
//   stats: {
//     subscribers: number;
//     programs: number;
//     rating: number;
//     monthly: number;
//   };
//   programs: CoachProgramItem[];
//   certs: CertificationItem[];
// };

// /* ===== API config & helper ===== */
// const API_BASE =
//   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
//     | string
//     | undefined) ?? "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1";

// type ProgramFromAPI = {
//   id: string | number;
//   title: string;
//   subscribers?: number;
//   rating?: number;
// };

// async function fetchProgramsByCoachId(
//   coachId: string | number,
//   token?: string
// ): Promise<ProgramFromAPI[]> {
//   const url = `${API_BASE}/programs/programCoach/${coachId}`;
//   const res = await axios.get(
//     url,
//     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
//   );
//   const raw = res?.data?.data;
//   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// }

// /* ===== helpers ===== */
// const toTitleCase = (s: string): string =>
//   s
//     .trim()
//     .split(/\s+/)
//     .map((part) =>
//       part
//         .split(/([-'])/)
//         .map((seg) =>
//           seg === "-" || seg === "'"
//             ? seg
//             : seg
//             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
//             : seg
//         )
//         .join("")
//     )
//     .join(" ");

// function resolveUserId(d: UserDBData): string | number | undefined {
//   return d.user.user_id ?? d.user_id;
// }

// /* ======= minimal API types + fetcher for user_id override ======= */
// type UserFromAPI = {
//   user_id?: string | number;
//   first_name: string;
//   second_name: string;
//   user_type: string; // "coach" or "athlete"
//   location?: string | null;
//   experience_level?: string | null;
//   email?: string | null;
//   avatar_url?: string | null;
// };
// type UserResp = { data?: UserFromAPI };

// async function getUserById(
//   id: string | number
// ): Promise<UserFromAPI | undefined> {
//   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
//   return data?.data;
// }

// const toSafeTitle = (s: string) =>
//   s
//     .trim()
//     .replace(/\s+/g, " ")
//     .replace(/\b\w/g, (m) => m.toUpperCase());

// export default function ProfilePage() {
//   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
//   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
//   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
//     "overview"
//   );
//   const [error, setError] = useState<string | null>(null);

//   const { userDB } = useGetUser();

//   /* === read ?user_id= and track viewing-other flag === */
//   const search = useSearchParams();
//   const userIdParam = search.get("user_id");
//   const [viewingOther, setViewingOther] = useState(false);

//   // ✅ sync viewingOther with URL & clear stale state when returning to self
//   useEffect(() => {
//     const other = Boolean(userIdParam);
//     setViewingOther(other);

//     if (!other) {
//       setCoachVM(null);
//       setAthleteVM(null);
//       setError(null);
//     }
//   }, [userIdParam]);

//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );

//   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();
//   const router = useRouter(); // ✅ for Back

//   // ✅ Back handler with safe fallback if no history stack
//   const handleBack = () => {
//     if (typeof window !== "undefined" && window.history.length > 1) {
//       router.back();
//     } else {
//       // choose a sensible fallback — programs is a common source of “View Profile”
//       router.push("/programs");
//     }
//   };

//   /* ===== override when user_id is present (other user's profile) ===== */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       console.log("hi");
//       if (!userIdParam) return;
//       try {
//         setLoading(true);
//         setError(null);

//         const u = await getUserById(userIdParam);
//         console.log("current user: ", u);
//         if (!u) throw new Error("User not found");

//         const r = (u.user_type ?? "athlete").toLowerCase();

//         if (r === "coach") {
//           const header: CoachProfileCore = {
//             id: u.user_id ?? userIdParam,
//             name:
//               toSafeTitle(
//                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
//               ) || "Coach",
//             email: u.email ?? "",
//             location: u.location ?? null,
//             joined_at: null,
//             avatar_url: u.avatar_url ?? null,
//             bio: u.experience_level ?? null,
//             tags: [],
//           };

//           setFetchingCoachPrograms(true);
//           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
//           const mapped: CoachProgramItem[] = list.map((p) => ({
//             id: p.id,
//             title: p.title,
//             subscribers: p.subscribers ?? 0,
//             rating: Number(p.rating ?? 0),
//           }));

//           if (cancelled) return;
//           setCoachVM({
//             header,
//             stats: {
//               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
//               programs: mapped.length,
//               rating:
//                 mapped.length > 0
//                   ? Math.round(
//                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) /
//                         mapped.length) *
//                         10
//                     ) / 10
//                   : 0,
//               monthly: 0,
//             },
//             programs: mapped,
//             certs: [],
//           });
//           setAthleteVM(null);
//         } else {
//           const profile: ProfileCore = {
//             id: u.user_id ?? userIdParam,
//             name:
//               toSafeTitle(
//                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
//               ) || "User",
//             email: u.email ?? "",
//             location: u.location ?? null,
//             joined_at: null,
//             avatar_url: u.avatar_url ?? null,
//             goals: u.experience_level ?? null,
//             experience: u.experience_level ?? null,
//           };

//           if (cancelled) return;
//           setAthleteVM({
//             user: {
//               ...profile,
//               location: profile.location ?? "San Francisco, CA",
//               joined_at: new Date().toISOString(),
//               goals: profile.goals ?? "Build muscle, improve strength",
//               experience: profile.experience ?? "Intermediate",
//             },
//             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
//             achievements: [],
//             subscriptions: [],
//           });
//           setCoachVM(null);
//         }
//       } catch (e) {
//         if (!cancelled)
//           setError(e instanceof Error ? e.message : "Failed to load profile.");
//       } finally {
//         if (!cancelled) {
//           setFetchingCoachPrograms(false);
//           setLoading(false);
//         }
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [userIdParam]);

//   /* build base VMs from userDB (self) */
//   useEffect(() => {
//     if (userIdParam) return;

//     setLoading(true);
//     setError(null);

//     try {
//       if (!userDB || !("data" in userDB)) {
//         setLoading(false);
//         setError("userDB is not ready.");
//         return;
//       }

//       const d: UserDBData = (userDB as UserDBShape).data;
//       const u: UserDBUser = d.user;

//       const email = d.email ?? "";
//       const rawFullName =
//         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
//         email.split("@")[0] ||
//         "User";
//       const fullName = toTitleCase(rawFullName);

//       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
//         const header: CoachProfileCore = {
//           id: resolveUserId(d) ?? "me",
//           name: fullName,
//           email,
//           location: u.location || null,
//           joined_at: null,
//           avatar_url: null,
//           bio: u.experience_level || null,
//           tags: [],
//         };

//         const coachBlock: CoachBlock = d.coach ?? {};
//         const seededPrograms: CoachProgramItem[] = Array.isArray(
//           coachBlock.programs
//         )
//           ? coachBlock.programs
//           : [];
//         const certs: CertificationItem[] = Array.isArray(
//           coachBlock.certifications
//         )
//           ? coachBlock.certifications
//           : [];

//         const vm: CoachVM = {
//           header,
//           stats: {
//             subscribers: coachBlock.subscribers ?? 0,
//             programs: seededPrograms.length,
//             rating: Number(coachBlock.rating ?? 0),
//             monthly: coachBlock.monthly_revenue ?? 0,
//           },
//           programs: seededPrograms,
//           certs,
//         };

//         setCoachVM(vm);
//         setAthleteVM(null);
//       } else {
//         const profile: ProfileCore = {
//           id: resolveUserId(d) ?? "me",
//           name: fullName,
//           email,
//           location: u.location || null,
//           joined_at: null,
//           avatar_url: u.avatar_url,
//           goals: u.experience_level || null, // reuse if desired

//           experience: u.experience_level || null,
//         };

//         const programs: ProgramLite[] = Array.isArray(d.programs)
//           ? d.programs
//           : [];
//         const achievements: Achievement[] = Array.isArray(d.achievements)
//           ? d.achievements
//           : [];
//         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
//           ? d.subscriptions
//           : [];

//         const workouts = Number(d.stats?.workouts ?? 0) || 0;
//         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

//         const vm: AthleteVM = {
//           user: {
//             ...profile,
//             location: profile.location ?? "San Francisco, CA",
//             joined_at: new Date().toISOString(),
//             goals: profile.goals ?? "Build muscle, improve strength",
//             experience: profile.experience ?? "Intermediate",
//           },
//           stats: {
//             workouts,
//             programs: programs.length,
//             achievements: achievements.length,
//             day_streak: dayStreak,
//           },
//           achievements: achievements
//             .slice(0, 3)
//             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
//           subscriptions: subscriptions.map((s) => ({
//             ...s,
//             status: s.status ?? "active",
//           })),
//         };

//         setAthleteVM(vm);
//         setCoachVM(null);
//       }
//     } catch (e) {
//       setError(
//         e instanceof Error ? e.message : "Failed to build profile from userDB."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [userDB, userIdParam]);

//   /* fetch real programs list/count for COACH (self only) */
//   useEffect(() => {
//     if (userIdParam) return;

//     const d = (userDB as UserDBShape | undefined)?.data;
//     if (!d) return;

//     const isCoachSelf =
//       (d.user.user_type ?? "athlete").toLowerCase() === "coach";
//     const coachId = resolveUserId(d);
//     if (!isCoachSelf || coachId === undefined) return;

//     let cancelled = false;
//     (async () => {
//       try {
//         setFetchingCoachPrograms(true);

//         const token = undefined; // add if needed

//         const list = await fetchProgramsByCoachId(coachId, token);
//         if (cancelled) return;

//         const mapped: CoachProgramItem[] = list.map((p) => ({
//           id: p.id,
//           title: p.title,
//           subscribers: p.subscribers ?? 0,
//           rating: Number(p.rating ?? 0),
//         }));

//         setCoachVM((prev) =>
//           prev
//             ? {
//                 ...prev,
//                 stats: { ...prev.stats, programs: mapped.length },
//                 programs: mapped,
//               }
//             : prev
//         );
//       } catch {
//         // optional: toast
//       } finally {
//         if (!cancelled) setFetchingCoachPrograms(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [userDB, userIdParam]);

//   const isCoach = role === "coach";

//   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach;
//   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
//   const { theme } = useGetTheme();

//   return (
//     <div
//       className={`min-h-screen${theme === "dark" ? "bg-black" : "bg-white"}`}
//     >
//       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
//         <Sidebar />
//       </Suspense>
//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//       ></main>

//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//         <div className="mx-auto max-w-6xl px-7 pb-24">
//           <header className="py-4 flex justify-between items-center">
//             <h1 className="text-4xl font-semibold">Profile</h1>
//             <ThemeToggle />
//           </header>

//           {/* header card */}
//           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
//             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8 justify-between items-center mr-5">
//               <div>
//                 {showLoading ? (
//                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
//                 ) : error ? (
//                   <div className="text-sm text-red-600">{error}</div>
//                 ) : displayCoach && coachVM ? (
//                   <CoachHeader data={coachVM.header} />
//                 ) : athleteVM ? (
//                   <ProfileHeader data={athleteVM.user} />
//                 ) : null}
//               </div>

//               <div className="flex gap-3">
//                 {/* Show Back when viewing other, otherwise show Logout */}
//                 {viewingOther ? (
//                   <button
//                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     onClick={handleBack}
//                   >
//                     Back
//                   </button>
//                 ) : (
//                   <button
//                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
//                     onClick={() => {
//                       window.location.href = "/";
//                       window.localStorage.removeItem("token");
//                       window.localStorage.removeItem("user");
//                     }}
//                   >
//                     Logout
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* stats row */}
//           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
//             {displayCoach && coachVM ? (
//               <>
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Users className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.subscribers}
//                   label="Subscribers"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.programs}
//                   label="Programs"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Star className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.rating}
//                   label="Rating"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
//                   value={coachVM.stats.monthly}
//                   label="Monthly"
//                 />
//               </>
//             ) : athleteVM ? (
//               <>
//                 <StatCard
//                   loading={showLoading}
//                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.workouts}
//                   label="Workouts"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.programs}
//                   label="Programs"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Award className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.achievements}
//                   label="Achievements"
//                 />
//                 <StatCard
//                   loading={showLoading}
//                   icon={<Flame className="h-5 w-5 text-red-600" />}
//                   value={athleteVM.stats.day_streak}
//                   label="Day Streak"
//                 />
//               </>
//             ) : null}
//           </section>

//           {/* tabs */}
//           <section className="mt-5">
//             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
//               <button
//                 onClick={() => setTab("overview")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "overview"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setTab("activity")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "activity"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Activity
//               </button>
//               <button
//                 onClick={() => setTab("settings")}
//                 className={`flex-1 rounded-full px-4 py-2 ${
//                   tab === "settings"
//                     ? "bg-white shadow text-zinc-900"
//                     : "text-zinc-600"
//                 }`}
//               >
//                 Settings
//               </button>
//             </div>

//             <div className="mt-4 space-y-4">
//               {tab === "overview" &&
//                 (displayCoach && coachVM ? (
//                   <>
//                     <CoachProgramsList
//                       loading={showLoading}
//                       items={coachVM.programs}
//                     />
//                     <CoachCertifications
//                       loading={showLoading}
//                       items={coachVM.certs}
//                     />
//                   </>
//                 ) : athleteVM ? (
//                   <>
//                     <SubscriptionsList
//                       loading={showLoading}
//                       items={athleteVM.subscriptions}
//                     />
//                     <RecentAchievements
//                       loading={showLoading}
//                       items={athleteVM.achievements}
//                     />
//                   </>
//                 ) : null)}

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

import { Suspense, useEffect, useMemo, useState } from "react";
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

import { useSearchParams, useRouter } from "next/navigation";
import ThemeToggle from "@/app/components/ThemeToggle";
import useGetTheme from "@/app/Hooks/useGetTheme";
import useGetUser from "@/app/Hooks/useGetUser";
import RecentAchievements from "./AchievementsCard";
import CoachCertifications, { CertificationItem } from "./CertificationsCard";
import CoachHeader, { CoachProfileCore } from "./CoachHeader";
import ProfileHeader, { ProfileCore } from "./ProfileHeader";
import CoachProgramsList, { CoachProgramItem } from "./ProgramsListCard";
import StatCard from "./StatGrid";
import SubscriptionsList from "./SubscriptionsCard";
import Sidebar from "@/app/components/shared/sidebar";
import {
  GetProgramsByCoachId,
  ProgramFromAPI,
} from "@/app/programs/services/addProgram.service";
import {
  getSubscriptionsByAthleteId,
  type AthleteSubscription,
} from "@/app/services/subscription.service";
import { Program } from "@/app/types/type";

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

type UserDBUser = {
  first_name: string;
  second_name: string;
  user_type: "coach" | "athlete" | string;
  location: string;
  phone: string;
  date_of_birth: string;
  last_login: string;
  experience_level: string;
  message: string;
  avatar_url?: string;
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
  email?: string;
  user_id?: string | number;
  programs?: ProgramLite[];
  achievements?: Achievement[];
  subscriptions?: Subscription[];
  stats?: { workouts?: number; day_streak?: number };
  coach?: CoachBlock;
};

type UserDBShape = { data: UserDBData };

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
    | undefined) ?? "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1";

/* this stays just for the user lookup */
type UserFromAPI = {
  user_id?: string | number;
  first_name: string;
  second_name: string;
  user_type: string;
  location?: string | null;
  experience_level?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};
type UserResp = { data?: UserFromAPI };

async function getUserById(
  id: string | number
): Promise<UserFromAPI | undefined> {
  const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
  return data?.data;
}

/* thin wrapper that uses the service */
async function fetchProgramsByCoachId(
  coachId: string | number
): Promise<ProgramFromAPI[]> {
  return GetProgramsByCoachId(coachId);
}

/* ===== subscriptions API helper (athlete) ===== */

type AthleteSubRow = {
  id: string | number;
  programs?: {
    title?: string;
    // if you joined coach user inside programs, it might be here:
    users?: { first_name?: string } | null;
  } | null;
  // root users is the athlete himself
  users?: { first_name?: string } | null;
};

async function fetchSubscriptionsForAthlete(
  athleteId: string | number
): Promise<Subscription[]> {
  try {
    const { data } = await axios.get(`${API_BASE}/subscripe/${athleteId}`);
    const rows: AthleteSubRow[] = Array.isArray(data?.data) ? data.data : [];

    return rows.map((row) => ({
      id: row.id,
      program_title: row.programs?.title ?? "Program",
      // prefer coach name from programs.users if you have that relation set up;
      // otherwise this will just be undefined.
      coach_name: row.programs?.users?.first_name ?? undefined,
      status: "active",
    }));
  } catch (e) {
    console.error("Failed to fetch athlete subscriptions", e);
    return [];
  }
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

const toSafeTitle = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function ProfilePage() {
  const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
  const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
  const [tab, setTab] = useState<"overview" | "activity" | "settings">(
    "overview"
  );
  const [error, setError] = useState<string | null>(null);

  const [subscripeProgram, setSubscripeProgram] = useState<
    AthleteSubscription[]
  >([]);

  const { userDB } = useGetUser();

  const search = useSearchParams();
  const userIdParam = search.get("user_id");
  const [viewingOther, setViewingOther] = useState(false);

  useEffect(() => {
    const other = Boolean(userIdParam);
    setViewingOther(other);

    if (!other) {
      setCoachVM(null);
      setAthleteVM(null);
      setError(null);
    }
  }, [userIdParam]);

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/programs");
    }
  };

  useEffect(() => {
    const fetchGetSubscripeProgram = async () => {
      const data = await getSubscriptionsByAthleteId(
        userDB?.data.user_id as string
      );
      setSubscripeProgram(data);
    };
    fetchGetSubscripeProgram();
  }, [userDB?.data.user_id]);

  /* ===== when viewing another user's profile via ?user_id= ===== */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userIdParam) return;
      try {
        setLoading(true);
        setError(null);

        const u = await getUserById(userIdParam);
        if (!u) throw new Error("User not found");

        const r = (u.user_type ?? "athlete").toLowerCase();

        if (r === "coach") {
          const header: CoachProfileCore = {
            id: u.user_id ?? userIdParam,
            name:
              toSafeTitle(
                `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
              ) || "Coach",
            email: u.email ?? "",
            location: u.location ?? null,
            joined_at: null,
            avatar_url: u.avatar_url ?? null,
            bio: u.experience_level ?? null,
            tags: [],
          };

          setFetchingCoachPrograms(true);
          const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
          const mapped: CoachProgramItem[] = list.map((p) => ({
            id: p.id,
            title: p.title,
            subscribers: p.subscribers ?? 0,
            rating: Number(p.rating ?? 0),
          }));

          if (cancelled) return;
          setCoachVM({
            header,
            stats: {
              subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
              programs: mapped.length,
              rating:
                mapped.length > 0
                  ? Math.round(
                      (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) /
                        mapped.length) *
                        10
                    ) / 10
                  : 0,
              monthly: 0,
            },
            programs: mapped,
            certs: [],
          });
          setAthleteVM(null);
        } else {
          const profile: ProfileCore = {
            id: u.user_id ?? userIdParam,
            name:
              toSafeTitle(
                `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
              ) || "User",
            email: u.email ?? "",
            location: u.location ?? null,
            joined_at: null,
            avatar_url: u.avatar_url ?? null,
            goals: u.experience_level ?? null,
            experience: u.experience_level ?? null,
          };

          if (cancelled) return;
          setAthleteVM({
            user: {
              ...profile,
              location: profile.location ?? "San Francisco, CA",
              joined_at: new Date().toISOString(),
              goals: profile.goals ?? "Build muscle, improve strength",
              experience: profile.experience ?? "Intermediate",
            },
            stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
            achievements: [],
            subscriptions: [], // will be filled by subscriptions effect
          });
          setCoachVM(null);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load profile.");
      } finally {
        if (!cancelled) {
          setFetchingCoachPrograms(false);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userIdParam]);

  /* ===== build base VMs from userDB when viewing self ===== */
  useEffect(() => {
    if (userIdParam) return;

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

      const email = d.email ?? "";
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
          joined_at: null,
          avatar_url: null,
          bio: u.experience_level || null,
          tags: [],
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
            programs: seededPrograms.length,
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
          avatar_url: u.avatar_url,
          goals: u.experience_level || null,
          experience: u.experience_level || null,
        };

        const programs: ProgramLite[] = Array.isArray(d.programs)
          ? d.programs
          : [];
        const achievements: Achievement[] = Array.isArray(d.achievements)
          ? d.achievements
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
          subscriptions: [], // will be filled by subscriptions effect
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
  }, [userDB, userIdParam]);

  /* ===== fetch real programs (list + count) for logged-in coach ===== */
  useEffect(() => {
    if (userIdParam) return;

    const d = (userDB as UserDBShape | undefined)?.data;
    if (!d) return;

    const isCoachSelf =
      (d.user.user_type ?? "athlete").toLowerCase() === "coach";
    const coachId = resolveUserId(d);
    if (!isCoachSelf || coachId === undefined) return;

    let cancelled = false;
    (async () => {
      try {
        setFetchingCoachPrograms(true);

        const list = await fetchProgramsByCoachId(coachId);
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
        // optional toast
      } finally {
        if (!cancelled) setFetchingCoachPrograms(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userDB, userIdParam]);

  /* ===== fetch real subscriptions for athlete (self OR other) ===== */

  const loggedInAthleteId = (userDB as UserDBShape | undefined)?.data?.user_id;
  const athleteIdToLoad = userIdParam ?? loggedInAthleteId;

  useEffect(() => {
    // only for athletes
    const isAthleteRole = (userDB?.data?.user?.user_type ?? "athlete")
      .toLowerCase()
      .includes("athlete");

    if (!isAthleteRole) return;
    if (!athleteIdToLoad) return;

    let cancelled = false;
    (async () => {
      const subs = await fetchSubscriptionsForAthlete(athleteIdToLoad);
      if (cancelled) return;

      setAthleteVM((prev) =>
        prev
          ? {
              ...prev,
              subscriptions: subs.map((s) => ({
                ...s,
                status: s.status ?? "active",
              })),
            }
          : prev
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [athleteIdToLoad, userDB?.data?.user?.user_type]);

  const isCoach = role === "coach";
  const displayCoach = viewingOther ? Boolean(coachVM) : isCoach;
  const showLoading = loading || (displayCoach && fetchingCoachPrograms);
  const { theme } = useGetTheme();

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>
      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-0 py-4 sm:py-6 md:py-8">
          <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 md:px-6 lg:px-0 pb-24">
            {/* header */}
            <header className="py-3 sm:py-4 flex items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Profile
              </h1>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <ThemeToggle />
              </div>
            </header>

            {/* header card */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-4 justify-between items-center sm:mr-5">
                <div className="w-full">
                  {showLoading ? (
                    <div className="h-24 sm:h-28 animate-pulse rounded-xl bg-zinc-200" />
                  ) : error ? (
                    <div className="text-sm text-red-600">{error}</div>
                  ) : displayCoach && coachVM ? (
                    <CoachHeader data={coachVM.header} />
                  ) : athleteVM ? (
                    <ProfileHeader data={athleteVM.user} />
                  ) : null}
                </div>

                <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-stretch sm:justify-end">
                  {viewingOther ? (
                    <button
                      className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      onClick={() => {
                        window.location.href = "/";
                        window.localStorage.removeItem("token");
                        window.localStorage.removeItem("user");
                      }}
                    >
                      Logout
                    </button>

<button
className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
onClick={() => {
  window.location.href = "/";
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
}}
>
Logout
</button>
                  )}
                </div>
              </div>
            </section>

            {/* stats row */}
            <section className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {displayCoach && coachVM ? (
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
                    value={subscripeProgram.length}
                    label="Subscribed Programs"
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
              <div className="flex gap-1 sm:gap-2 rounded-full bg-zinc-100 p-1 text-xs sm:text-sm">
                <button
                  onClick={() => setTab("overview")}
                  className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
                    tab === "overview"
                      ? "bg-white shadow text-zinc-900"
                      : "text-zinc-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setTab("activity")}
                  className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
                    tab === "activity"
                      ? "bg-white shadow text-zinc-900"
                      : "text-zinc-600"
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setTab("settings")}
                  className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
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
                  (displayCoach && coachVM ? (
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
      </main>
    </div>
  );
}
