
// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import axios from "axios";
// // import {
// //   TrendingUp,
// //   BookOpen,
// //   Award,
// //   Flame,
// //   Users,
// //   DollarSign,
// //   Star,
// // } from "lucide-react";

// // import RecentAchievements from "./components/AchievementsCard";
// // import ProfileHeader, { ProfileCore } from "./components/ProfileHeader";
// // import StatCard from "./components/StatGrid";
// // import SubscriptionsList from "./components/SubscriptionsCard";
// // import Sidebar from "../components/shared/sidebar";
// // import useGetUser from "../Hooks/useGetUser";

// // /* coach components */
// // import CoachHeader, { CoachProfileCore } from "./components/CoachHeader";
// // // import CoachProgramsList, {
// // //   CoachProgramItem,
// // // } from "./components/ProgramsListCard";
// // // import CoachCertifications, {
// // //   CertificationItem,
// // // } from "./components/CertificationsCard";
// // // import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
// // // import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
// // import ThemeToggle from "../components/ThemeToggle";
// // import useGetTheme from "../Hooks/useGetTheme";
// // import CoachCertifications, { CertificationItem } from "./components/CertificationsCard";
// // import CoachProgramsList, { CoachProgramItem } from "./components/ProgramsListCard";
// // import { useSearchParams } from "next/navigation"; // ✅ ADDED

// // /* ===== strict types ===== */
// // type ProgramLite = { id: string | number; title: string };
// // type Achievement = {
// //   id: string | number;
// //   title: string;
// //   date?: string;
// //   emoji?: string;
// // };
// // type Subscription = {
// //   id: string | number;
// //   program_title: string;
// //   coach_name?: string;
// //   status?: "active" | "paused" | "expired";
// // };

// // /** this matches the shape you reported in the error */
// // type UserDBUser = {
// //   first_name: string;
// //   second_name: string; // instead of last_name
// //   user_type: "coach" | "athlete" | string;
// //   location: string;
// //   phone: string;
// //   date_of_birth: string;
// //   last_login: string;
// //   experience_level: string; // re-used as "bio"
// //   message: string;

// //   /* IDs the backend may also send */
// //   user_id?: string | number;
// // };

// // type CoachBlock = {
// //   subscribers?: number;
// //   monthly_revenue?: number;
// //   rating?: number;
// //   certifications?: CertificationItem[];
// //   programs?: CoachProgramItem[];
// // };

// // type UserDBData = {
// //   user: UserDBUser;
// //   email?: string; // if you store it at the root
// //   user_id?: string | number; // optional root fallback id

// //   /* athlete bits */
// //   programs?: ProgramLite[];
// //   achievements?: Achievement[];
// //   subscriptions?: Subscription[];
// //   stats?: { workouts?: number; day_streak?: number };

// //   /* optional coach extras */
// //   coach?: CoachBlock;
// // };

// // type UserDBShape = { data: UserDBData };

// // /* view models */
// // type AthleteVM = {
// //   user: ProfileCore;
// //   stats: {
// //     workouts: number;
// //     programs: number;
// //     achievements: number;
// //     day_streak: number;
// //   };
// //   achievements: Achievement[];
// //   subscriptions: Subscription[];
// // };

// // type CoachVM = {
// //   header: CoachProfileCore;
// //   stats: {
// //     subscribers: number;
// //     programs: number;
// //     rating: number;
// //     monthly: number;
// //   };
// //   programs: CoachProgramItem[];
// //   certs: CertificationItem[];
// // };


// // /* ===== API config & helper ===== */
// // const API_BASE =
// //   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
// //     | string
// //     | undefined) ?? "http://127.0.0.1:4000/api/v1";

// // type ProgramFromAPI = {
// //   id: string | number;
// //   title: string;
// //   subscribers?: number;
// //   rating?: number;
// // };

// // async function fetchProgramsByCoachId(
// //   coachId: string | number,
// //   token?: string
// // ): Promise<ProgramFromAPI[]> {
// //   const url = `${API_BASE}/programs/programCoach/${coachId}`;
// //   const res = await axios.get(
// //     url,
// //     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
// //   );
// //   const raw = res?.data?.data;
// //   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// // }

// // /* ===== helpers ===== */
// // const toTitleCase = (s: string): string =>
// //   s
// //     .trim()
// //     .split(/\s+/)
// //     .map((part) =>
// //       part
// //         .split(/([-'])/)
// //         .map((seg) =>
// //           seg === "-" || seg === "'"
// //             ? seg
// //             : seg
// //             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
// //             : seg
// //         )
// //         .join("")
// //     )
// //     .join(" ");

// // function resolveUserId(d: UserDBData): string | number | undefined {
// //   return d.user.user_id ?? d.user_id;
// // }

// // /* ======= ADDED: minimal API types + fetcher for user_id override ======= */
// // type UserFromAPI = {
// //   user_id?: string | number;
// //   first_name: string;
// //   second_name: string;
// //   user_type: string; // "coach" or "athlete"
// //   location?: string | null;
// //   experience_level?: string | null;
// //   email?: string | null;
// //   avatar_url?: string | null;
// // };
// // type UserResp = { data?: UserFromAPI };

// // async function getUserById(id: string | number): Promise<UserFromAPI | undefined> {
// //   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
// //   return data?.data;
// // }

// // const toSafeTitle = (s: string) =>
// //   s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
// // /* ===================================================================== */

// // export default function ProfilePage() {
// //   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
// //   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
// //   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
// //     "overview"
// //   );
// //   const [error, setError] = useState<string | null>(null);

// //   const { userDB } = useGetUser();

// //   /* === ADDED: read ?user_id= and track viewing-other flag === */
// //   const search = useSearchParams();
// //   const userIdParam = search.get("user_id");
// //   const [viewingOther, setViewingOther] = useState(false);
// //   /* ========================================================= */

// //   const shellVars = useMemo(
// //     () =>
// //       ({
// //         "--sb-w": "88px",
// //         "--extra-left": "24px",
// //       } as React.CSSProperties),
// //     []
// //   );

// //   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();

// //   /* ===== ADDED: override when user_id is present (before your original effect) ===== */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       if (!userIdParam) return; // only run when overriding
// //       try {
// //         setViewingOther(true);
// //         setLoading(true);
// //         setError(null);

// //         const u = await getUserById(userIdParam);
// //         if (!u) throw new Error("User not found");

// //         const r = (u.user_type ?? "athlete").toLowerCase();

// //         if (r === "coach") {
// //           const header: CoachProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "Coach",
// //             // Never pass null to avoid your email error; use undefined if missing
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             bio: u.experience_level ?? null,
// //             tags: [],
// //           };

// //           setFetchingCoachPrograms(true);
// //           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
// //           const mapped: CoachProgramItem[] = list.map((p) => ({
// //             id: p.id,
// //             title: p.title,
// //             subscribers: p.subscribers ?? 0,
// //             rating: Number(p.rating ?? 0),
// //           }));

// //           if (cancelled) return;
// //           setCoachVM({
// //             header,
// //             stats: {
// //               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
// //               programs: mapped.length,
// //               rating:
// //                 mapped.length > 0
// //                   ? Math.round(
// //                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) / mapped.length) * 10
// //                     ) / 10
// //                   : 0,
// //               monthly: 0,
// //             },
// //             programs: mapped,
// //             certs: [],
// //           });
// //           setAthleteVM(null);
// //         } else {
// //           const profile: ProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "User",
// //             email: u.email ?? "", // avoid null
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             goals: u.experience_level ?? null,
// //             experience: u.experience_level ?? null,
// //           };

// //           if (cancelled) return;
// //           setAthleteVM({
// //             user: {
// //               ...profile,
// //               location: profile.location ?? "San Francisco, CA",
// //               joined_at: new Date().toISOString(),
// //               goals: profile.goals ?? "Build muscle, improve strength",
// //               experience: profile.experience ?? "Intermediate",
// //             },
// //             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
// //             achievements: [],
// //             subscriptions: [],
// //           });
// //           setCoachVM(null);
// //         }
// //       } catch (e) {
// //         if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile.");
// //       } finally {
// //         if (!cancelled) {
// //           setFetchingCoachPrograms(false);
// //           setLoading(false);
// //         }
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userIdParam]);
// //   /* ================================================================================ */

// //   /* build base VMs from userDB */
// //   useEffect(() => {
// //     if (userIdParam) return; // ✅ skip self-build when viewing someone else

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       if (!userDB || !("data" in userDB)) {
// //         setLoading(false);
// //         setError("userDB is not ready.");
// //         return;
// //       }

// //       const d: UserDBData = (userDB as UserDBShape).data;
// //       const u: UserDBUser = d.user;

// //       const email = d.email ?? ""; // adjust if you store email elsewhere
// //       const rawFullName =
// //         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
// //         email.split("@")[0] ||
// //         "User";
// //       const fullName = toTitleCase(rawFullName);

// //       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
// //         const header: CoachProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null, // not present in your shape
// //           avatar_url: null, // not present in your shape
// //           bio: u.experience_level || null,
// //           tags: [], // fill if available
// //         };

// //         const coachBlock: CoachBlock = d.coach ?? {};
// //         const seededPrograms: CoachProgramItem[] = Array.isArray(
// //           coachBlock.programs
// //         )
// //           ? coachBlock.programs
// //           : [];
// //         const certs: CertificationItem[] = Array.isArray(
// //           coachBlock.certifications
// //         )
// //           ? coachBlock.certifications
// //           : [];

// //         const vm: CoachVM = {
// //           header,
// //           stats: {
// //             subscribers: coachBlock.subscribers ?? 0,
// //             programs: seededPrograms.length, // will be updated after API call
// //             rating: Number(coachBlock.rating ?? 0),
// //             monthly: coachBlock.monthly_revenue ?? 0,
// //           },
// //           programs: seededPrograms,
// //           certs,
// //         };

// //         setCoachVM(vm);
// //         setAthleteVM(null);
// //       } else {
// //         const profile: ProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: null,
// //           goals: u.experience_level || null, // reuse if desired
// //           experience: u.experience_level || null,
// //         };

// //         const programs: ProgramLite[] = Array.isArray(d.programs)
// //           ? d.programs
// //           : [];
// //         const achievements: Achievement[] = Array.isArray(d.achievements)
// //           ? d.achievements
// //           : [];
// //         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
// //           ? d.subscriptions
// //           : [];

// //         const workouts = Number(d.stats?.workouts ?? 0) || 0;
// //         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

// //         const vm: AthleteVM = {
// //           user: {
// //             ...profile,
// //             location: profile.location ?? "San Francisco, CA",
// //             joined_at: new Date().toISOString(),
// //             goals: profile.goals ?? "Build muscle, improve strength",
// //             experience: profile.experience ?? "Intermediate",
// //           },
// //           stats: {
// //             workouts,
// //             programs: programs.length,
// //             achievements: achievements.length,
// //             day_streak: dayStreak,
// //           },
// //           achievements: achievements
// //             .slice(0, 3)
// //             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
// //           subscriptions: subscriptions.map((s) => ({
// //             ...s,
// //             status: s.status ?? "active",
// //           })),
// //         };

// //         setAthleteVM(vm);
// //         setCoachVM(null);
// //       }
// //     } catch (e) {
// //       setError(
// //         e instanceof Error ? e.message : "Failed to build profile from userDB."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [userDB, userIdParam]);

// //   /* fetch real programs list/count for COACH */
// //   useEffect(() => {
// //     if (userIdParam) return; // ✅ skip self refresh when viewing someone else

// //     const d = (userDB as UserDBShape | undefined)?.data;
// //     if (!d) return;

// //     const isCoachSelf = (d.user.user_type ?? "athlete").toLowerCase() === "coach";
// //     const coachId = resolveUserId(d);
// //     if (!isCoachSelf || coachId === undefined) return;

// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setFetchingCoachPrograms(true);

// //         // If you need auth, read token from localStorage or userDB and pass to helper.
// //         // const token = JSON.parse(localStorage.getItem("user") || "{}")?.data?.access_token as string | undefined;
// //         const token = undefined;

// //         const list = await fetchProgramsByCoachId(coachId, token);
// //         if (cancelled) return;

// //         const mapped: CoachProgramItem[] = list.map((p) => ({
// //           id: p.id,
// //           title: p.title,
// //           subscribers: p.subscribers ?? 0,
// //           rating: Number(p.rating ?? 0),
// //         }));

// //         setCoachVM((prev) =>
// //           prev
// //             ? {
// //                 ...prev,
// //                 stats: { ...prev.stats, programs: mapped.length },
// //                 programs: mapped,
// //               }
// //             : prev
// //         );
// //       } catch {
// //         // optional: surface an error toast
// //       } finally {
// //         if (!cancelled) setFetchingCoachPrograms(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userDB, userIdParam]);

// //   const isCoach = role === "coach";
// //   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach; // ✅ ADDED
// //   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
// //   const {theme} = useGetTheme()
// //   return (
// //     <div className={`min-h-screen${theme === "dark" ? "bg-black": "bg-white"}`}>
// //       <Sidebar />
// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
// //       ></main>

// //       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //         <div className="mx-auto max-w-6xl px-7 pb-24">
// //           <header className="py-4 flex justify-between items-center">
// //             <h1 className="text-4xl font-semibold">Profile</h1>
// //             <ThemeToggle />
// //           </header>

// //           {/* header card */}
// //           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
// //             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8  justify-between items-center mr-5">
// //               <div>
// //                 {showLoading ? (
// //                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
// //                 ) : error ? (
// //                   <div className="text-sm text-red-600">{error}</div>
// //                 ) : displayCoach && coachVM ? (  /* ✅ use displayCoach */
// //                   <CoachHeader data={coachVM.header} />
// //                 ) : athleteVM ? (
// //                   <ProfileHeader data={athleteVM.user} />
// //                 ) : null}
// //               </div>

// //               <div>
// //                 {!viewingOther && (  /* ✅ hide logout when viewing other */
// //                   <button
// //                     className="bg-gradient-to-r  from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={() => {
// //                       window.location.href = "/";
// //                       window.localStorage.removeItem("token");
// //                       window.localStorage.removeItem("user");
// //                     }}
// //                   >
// //                     Logout
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* stats row */}
// //           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
// //             {displayCoach && coachVM ? (   /* ✅ use displayCoach */
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Users className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.subscribers}
// //                   label="Subscribers"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Star className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.rating}
// //                   label="Rating"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.monthly}
// //                   label="Monthly"
// //                 />
// //               </>
// //             ) : athleteVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.workouts}
// //                   label="Workouts"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Award className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.achievements}
// //                   label="Achievements"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Flame className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.day_streak}
// //                   label="Day Streak"
// //                 />
// //               </>
// //             ) : null}
// //           </section>

// //           {/* tabs */}
// //           <section className="mt-5">
// //             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
// //               <button
// //                 onClick={() => setTab("overview")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "overview"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Overview
// //               </button>
// //               <button
// //                 onClick={() => setTab("activity")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "activity"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Activity
// //               </button>
// //               <button
// //                 onClick={() => setTab("settings")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "settings"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Settings
// //               </button>
// //             </div>

// //             <div className="mt-4 space-y-4">
// //               {tab === "overview" &&
// //                 (displayCoach && coachVM ? (   /* ✅ use displayCoach */
// //                   <>
// //                     <CoachProgramsList
// //                       loading={showLoading}
// //                       items={coachVM.programs}
// //                     />
// //                     <CoachCertifications
// //                       loading={showLoading}
// //                       items={coachVM.certs}
// //                     />
// //                   </>
// //                 ) : athleteVM ? (
// //                   <>
// //                     <SubscriptionsList
// //                       loading={showLoading}
// //                       items={athleteVM.subscriptions}
// //                     />
// //                     <RecentAchievements
// //                       loading={showLoading}
// //                       items={athleteVM.achievements}
// //                     />
// //                   </>
// //                 ) : null)}

// //               {tab === "activity" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Activity feed coming soon.
// //                 </div>
// //               )}
// //               {tab === "settings" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Settings UI coming soon.
// //                 </div>
// //               )}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // "use client";

// // import { Suspense, useEffect, useMemo, useState } from "react";
// // import axios from "axios";
// // import {
// //   TrendingUp,
// //   BookOpen,
// //   Award,
// //   Flame,
// //   Users,
// //   DollarSign,
// //   Star,
// // } from "lucide-react";

// // import { useSearchParams, useRouter } from "next/navigation"; // ✅ added useRouter
// // import ThemeToggle from "@/app/components/ThemeToggle";
// // import useGetTheme from "@/app/Hooks/useGetTheme";
// // import useGetUser from "@/app/Hooks/useGetUser";
// // import RecentAchievements from "./AchievementsCard";
// // import CoachCertifications, { CertificationItem } from "./CertificationsCard";
// // import CoachHeader, { CoachProfileCore } from "./CoachHeader";
// // import ProfileHeader, { ProfileCore } from "./ProfileHeader";
// // import CoachProgramsList, { CoachProgramItem } from "./ProgramsListCard";
// // import StatCard from "./StatGrid";
// // import SubscriptionsList from "./SubscriptionsCard";
// // import Sidebar from "@/app/components/shared/sidebar";

// // /* ===== strict types ===== */
// // type ProgramLite = { id: string | number; title: string };
// // type Achievement = {
// //   id: string | number;
// //   title: string;
// //   date?: string;
// //   emoji?: string;
// // };
// // type Subscription = {
// //   id: string | number;
// //   program_title: string;
// //   coach_name?: string;
// //   status?: "active" | "paused" | "expired";
// // };

// // /** this matches the shape you reported in the error */
// // type UserDBUser = {
// //   first_name: string;
// //   second_name: string; // instead of last_name
// //   user_type: "coach" | "athlete" | string;
// //   location: string;
// //   phone: string;
// //   date_of_birth: string;
// //   last_login: string;
// //   experience_level: string; // re-used as "bio"
// //   message: string;
// //   avatar_url?: string;

// //   /* IDs the backend may also send */
// //   user_id?: string | number;
// // };

// // type CoachBlock = {
// //   subscribers?: number;
// //   monthly_revenue?: number;
// //   rating?: number;
// //   certifications?: CertificationItem[];
// //   programs?: CoachProgramItem[];
// // };

// // type UserDBData = {
// //   user: UserDBUser;
// //   email?: string; // if you store it at the root
// //   user_id?: string | number; // optional root fallback id

// //   /* athlete bits */
// //   programs?: ProgramLite[];
// //   achievements?: Achievement[];
// //   subscriptions?: Subscription[];
// //   stats?: { workouts?: number; day_streak?: number };

// //   /* optional coach extras */
// //   coach?: CoachBlock;
// // };

// // type UserDBShape = { data: UserDBData };

// // /* view models */
// // type AthleteVM = {
// //   user: ProfileCore;
// //   stats: {
// //     workouts: number;
// //     programs: number;
// //     achievements: number;
// //     day_streak: number;
// //   };
// //   achievements: Achievement[];
// //   subscriptions: Subscription[];
// // };

// // type CoachVM = {
// //   header: CoachProfileCore;
// //   stats: {
// //     subscribers: number;
// //     programs: number;
// //     rating: number;
// //     monthly: number;
// //   };
// //   programs: CoachProgramItem[];
// //   certs: CertificationItem[];
// // };

// // /* ===== API config & helper ===== */
// // const API_BASE =
// //   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
// //     | string
// //     | undefined) ?? "http://127.0.0.1:4000/api/v1";

// // type ProgramFromAPI = {
// //   id: string | number;
// //   title: string;
// //   subscribers?: number;
// //   rating?: number;
// // };

// // async function fetchProgramsByCoachId(
// //   coachId: string | number,
// //   token?: string
// // ): Promise<ProgramFromAPI[]> {
// //   const url = `${API_BASE}/programs/programCoach/${coachId}`;
// //   const res = await axios.get(
// //     url,
// //     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
// //   );
// //   const raw = res?.data?.data;
// //   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// // }

// // /* ===== helpers ===== */
// // const toTitleCase = (s: string): string =>
// //   s
// //     .trim()
// //     .split(/\s+/)
// //     .map((part) =>
// //       part
// //         .split(/([-'])/)
// //         .map((seg) =>
// //           seg === "-" || seg === "'"
// //             ? seg
// //             : seg
// //             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
// //             : seg
// //         )
// //         .join("")
// //     )
// //     .join(" ");

// // function resolveUserId(d: UserDBData): string | number | undefined {
// //   return d.user.user_id ?? d.user_id;
// // }

// // /* ======= minimal API types + fetcher for user_id override ======= */
// // type UserFromAPI = {
// //   user_id?: string | number;
// //   first_name: string;
// //   second_name: string;
// //   user_type: string; // "coach" or "athlete"
// //   location?: string | null;
// //   experience_level?: string | null;
// //   email?: string | null;
// //   avatar_url?: string | null;
// // };
// // type UserResp = { data?: UserFromAPI };

// // async function getUserById(
// //   id: string | number
// // ): Promise<UserFromAPI | undefined> {
// //   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
// //   return data?.data;
// // }

// // const toSafeTitle = (s: string) =>
// //   s
// //     .trim()
// //     .replace(/\s+/g, " ")
// //     .replace(/\b\w/g, (m) => m.toUpperCase());

// // export default function ProfilePage() {
// //   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
// //   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
// //   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
// //     "overview"
// //   );
// //   const [error, setError] = useState<string | null>(null);

// //   const { userDB } = useGetUser();

// //   /* === read ?user_id= and track viewing-other flag === */
// //   const search = useSearchParams();
// //   const userIdParam = search.get("user_id");
// //   const [viewingOther, setViewingOther] = useState(false);

// //   // ✅ sync viewingOther with URL & clear stale state when returning to self
// //   useEffect(() => {
// //     const other = Boolean(userIdParam);
// //     setViewingOther(other);

// //     if (!other) {
// //       setCoachVM(null);
// //       setAthleteVM(null);
// //       setError(null);
// //     }
// //   }, [userIdParam]);

// //   const shellVars = useMemo(
// //     () =>
// //       ({
// //         "--sb-w": "88px",
// //         "--extra-left": "24px",
// //       } as React.CSSProperties),
// //     []
// //   );

// //   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();
// //   const router = useRouter(); // ✅ for Back

// //   // ✅ Back handler with safe fallback if no history stack
// //   const handleBack = () => {
// //     if (typeof window !== "undefined" && window.history.length > 1) {
// //       router.back();
// //     } else {
// //       // choose a sensible fallback — programs is a common source of “View Profile”
// //       router.push("/programs");
// //     }
// //   };

// //   /* ===== override when user_id is present (other user's profile) ===== */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       console.log("hi");
// //       if (!userIdParam) return;
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const u = await getUserById(userIdParam);
// //         console.log("current user: ", u);
// //         if (!u) throw new Error("User not found");

// //         const r = (u.user_type ?? "athlete").toLowerCase();

// //         if (r === "coach") {
// //           const header: CoachProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name:
// //               toSafeTitle(
// //                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
// //               ) || "Coach",
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             bio: u.experience_level ?? null,
// //             tags: [],
// //           };

// //           setFetchingCoachPrograms(true);
// //           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
// //           const mapped: CoachProgramItem[] = list.map((p) => ({
// //             id: p.id,
// //             title: p.title,
// //             subscribers: p.subscribers ?? 0,
// //             rating: Number(p.rating ?? 0),
// //           }));

// //           if (cancelled) return;
// //           setCoachVM({
// //             header,
// //             stats: {
// //               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
// //               programs: mapped.length,
// //               rating:
// //                 mapped.length > 0
// //                   ? Math.round(
// //                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) /
// //                         mapped.length) *
// //                         10
// //                     ) / 10
// //                   : 0,
// //               monthly: 0,
// //             },
// //             programs: mapped,
// //             certs: [],
// //           });
// //           setAthleteVM(null);
// //         } else {
// //           const profile: ProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name:
// //               toSafeTitle(
// //                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
// //               ) || "User",
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             goals: u.experience_level ?? null,
// //             experience: u.experience_level ?? null,
// //           };

// //           if (cancelled) return;
// //           setAthleteVM({
// //             user: {
// //               ...profile,
// //               location: profile.location ?? "San Francisco, CA",
// //               joined_at: new Date().toISOString(),
// //               goals: profile.goals ?? "Build muscle, improve strength",
// //               experience: profile.experience ?? "Intermediate",
// //             },
// //             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
// //             achievements: [],
// //             subscriptions: [],
// //           });
// //           setCoachVM(null);
// //         }
// //       } catch (e) {
// //         if (!cancelled)
// //           setError(e instanceof Error ? e.message : "Failed to load profile.");
// //       } finally {
// //         if (!cancelled) {
// //           setFetchingCoachPrograms(false);
// //           setLoading(false);
// //         }
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userIdParam]);

// //   /* build base VMs from userDB (self) */
// //   useEffect(() => {
// //     if (userIdParam) return;

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       if (!userDB || !("data" in userDB)) {
// //         setLoading(false);
// //         setError("userDB is not ready.");
// //         return;
// //       }

// //       const d: UserDBData = (userDB as UserDBShape).data;
// //       const u: UserDBUser = d.user;

// //       const email = d.email ?? "";
// //       const rawFullName =
// //         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
// //         email.split("@")[0] ||
// //         "User";
// //       const fullName = toTitleCase(rawFullName);

// //       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
// //         const header: CoachProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: null,
// //           bio: u.experience_level || null,
// //           tags: [],
// //         };

// //         const coachBlock: CoachBlock = d.coach ?? {};
// //         const seededPrograms: CoachProgramItem[] = Array.isArray(
// //           coachBlock.programs
// //         )
// //           ? coachBlock.programs
// //           : [];
// //         const certs: CertificationItem[] = Array.isArray(
// //           coachBlock.certifications
// //         )
// //           ? coachBlock.certifications
// //           : [];

// //         const vm: CoachVM = {
// //           header,
// //           stats: {
// //             subscribers: coachBlock.subscribers ?? 0,
// //             programs: seededPrograms.length,
// //             rating: Number(coachBlock.rating ?? 0),
// //             monthly: coachBlock.monthly_revenue ?? 0,
// //           },
// //           programs: seededPrograms,
// //           certs,
// //         };

// //         setCoachVM(vm);
// //         setAthleteVM(null);
// //       } else {
// //         const profile: ProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: u.avatar_url,
// //           goals: u.experience_level || null, // reuse if desired

// //           experience: u.experience_level || null,
// //         };

// //         const programs: ProgramLite[] = Array.isArray(d.programs)
// //           ? d.programs
// //           : [];
// //         const achievements: Achievement[] = Array.isArray(d.achievements)
// //           ? d.achievements
// //           : [];
// //         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
// //           ? d.subscriptions
// //           : [];

// //         const workouts = Number(d.stats?.workouts ?? 0) || 0;
// //         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

// //         const vm: AthleteVM = {
// //           user: {
// //             ...profile,
// //             location: profile.location ?? "San Francisco, CA",
// //             joined_at: new Date().toISOString(),
// //             goals: profile.goals ?? "Build muscle, improve strength",
// //             experience: profile.experience ?? "Intermediate",
// //           },
// //           stats: {
// //             workouts,
// //             programs: programs.length,
// //             achievements: achievements.length,
// //             day_streak: dayStreak,
// //           },
// //           achievements: achievements
// //             .slice(0, 3)
// //             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
// //           subscriptions: subscriptions.map((s) => ({
// //             ...s,
// //             status: s.status ?? "active",
// //           })),
// //         };

// //         setAthleteVM(vm);
// //         setCoachVM(null);
// //       }
// //     } catch (e) {
// //       setError(
// //         e instanceof Error ? e.message : "Failed to build profile from userDB."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [userDB, userIdParam]);

// //   /* fetch real programs list/count for COACH (self only) */
// //   useEffect(() => {
// //     if (userIdParam) return;

// //     const d = (userDB as UserDBShape | undefined)?.data;
// //     if (!d) return;

// //     const isCoachSelf =
// //       (d.user.user_type ?? "athlete").toLowerCase() === "coach";
// //     const coachId = resolveUserId(d);
// //     if (!isCoachSelf || coachId === undefined) return;

// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setFetchingCoachPrograms(true);

// //         const token = undefined; // add if needed

// //         const list = await fetchProgramsByCoachId(coachId, token);
// //         if (cancelled) return;

// //         const mapped: CoachProgramItem[] = list.map((p) => ({
// //           id: p.id,
// //           title: p.title,
// //           subscribers: p.subscribers ?? 0,
// //           rating: Number(p.rating ?? 0),
// //         }));

// //         setCoachVM((prev) =>
// //           prev
// //             ? {
// //                 ...prev,
// //                 stats: { ...prev.stats, programs: mapped.length },
// //                 programs: mapped,
// //               }
// //             : prev
// //         );
// //       } catch {
// //         // optional: toast
// //       } finally {
// //         if (!cancelled) setFetchingCoachPrograms(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userDB, userIdParam]);

// //   const isCoach = role === "coach";

// //   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach;
// //   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
// //   const { theme } = useGetTheme();

// //   return (
// //     <div
// //       className={`min-h-screen${theme === "dark" ? "bg-black" : "bg-white"}`}
// //     >
// //       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
// //         <Sidebar />
// //       </Suspense>
// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
// //       ></main>

// //       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //         <div className="mx-auto max-w-6xl px-7 pb-24">
// //           <header className="py-4 flex justify-between items-center">
// //             <h1 className="text-4xl font-semibold">Profile</h1>
// //             <ThemeToggle />
// //           </header>

// //           {/* header card */}
// //           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
// //             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8 justify-between items-center mr-5">
// //               <div>
// //                 {showLoading ? (
// //                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
// //                 ) : error ? (
// //                   <div className="text-sm text-red-600">{error}</div>
// //                 ) : displayCoach && coachVM ? (
// //                   <CoachHeader data={coachVM.header} />
// //                 ) : athleteVM ? (
// //                   <ProfileHeader data={athleteVM.user} />
// //                 ) : null}
// //               </div>

// //               <div className="flex gap-3">
// //                 {/* Show Back when viewing other, otherwise show Logout */}
// //                 {viewingOther ? (
// //                   <button
// //                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={handleBack}
// //                   >
// //                     Back
// //                   </button>
// //                 ) : (
// //                   <button
// //                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={() => {
// //                       window.location.href = "/";
// //                       window.localStorage.removeItem("token");
// //                       window.localStorage.removeItem("user");
// //                     }}
// //                   >
// //                     Logout
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* stats row */}
// //           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
// //             {displayCoach && coachVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Users className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.subscribers}
// //                   label="Subscribers"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Star className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.rating}
// //                   label="Rating"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.monthly}
// //                   label="Monthly"
// //                 />
// //               </>
// //             ) : athleteVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.workouts}
// //                   label="Workouts"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Award className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.achievements}
// //                   label="Achievements"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Flame className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.day_streak}
// //                   label="Day Streak"
// //                 />
// //               </>
// //             ) : null}
// //           </section>

// //           {/* tabs */}
// //           <section className="mt-5">
// //             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
// //               <button
// //                 onClick={() => setTab("overview")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "overview"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Overview
// //               </button>
// //               <button
// //                 onClick={() => setTab("activity")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "activity"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Activity
// //               </button>
// //               <button
// //                 onClick={() => setTab("settings")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "settings"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Settings
// //               </button>
// //             </div>

// //             <div className="mt-4 space-y-4">
// //               {tab === "overview" &&
// //                 (displayCoach && coachVM ? (
// //                   <>
// //                     <CoachProgramsList
// //                       loading={showLoading}
// //                       items={coachVM.programs}
// //                     />
// //                     <CoachCertifications
// //                       loading={showLoading}
// //                       items={coachVM.certs}
// //                     />
// //                   </>
// //                 ) : athleteVM ? (
// //                   <>
// //                     <SubscriptionsList
// //                       loading={showLoading}
// //                       items={athleteVM.subscriptions}
// //                     />
// //                     <RecentAchievements
// //                       loading={showLoading}
// //                       items={athleteVM.achievements}
// //                     />
// //                   </>
// //                 ) : null)}

// //               {tab === "activity" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Activity feed coming soon.
// //                 </div>
// //               )}
// //               {tab === "settings" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Settings UI coming soon.
// //                 </div>
// //               )}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
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
//     | undefined) ?? "https://godzilla-be.vercel.app/api/v1";

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



// /* ===== API config & helper ===== */
// const API_BASE =
//   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
//     | string
//     | undefined) ?? "https://godzilla-be.vercel.app/api/v1";


// // type ProgramFromAPI = {
// //   id: string | number;
// //   title: string;
// //   subscribers?: number;
// //   rating?: number;
// // };

// // async function fetchProgramsByCoachId(
// //   coachId: string | number,
// //   token?: string
// // ): Promise<ProgramFromAPI[]> {
// //   const url = `${API_BASE}/programs/programCoach/${coachId}`;
// //   const res = await axios.get(
// //     url,
// //     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
// //   );
// //   const raw = res?.data?.data;
// //   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// // }

// // /* ===== helpers ===== */
// // const toTitleCase = (s: string): string =>
// //   s
// //     .trim()
// //     .split(/\s+/)
// //     .map((part) =>
// //       part
// //         .split(/([-'])/)
// //         .map((seg) =>
// //           seg === "-" || seg === "'"
// //             ? seg
// //             : seg
// //             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
// //             : seg
// //         )
// //         .join("")
// //     )
// //     .join(" ");

// // function resolveUserId(d: UserDBData): string | number | undefined {
// //   return d.user.user_id ?? d.user_id;
// // }

// // /* ======= ADDED: minimal API types + fetcher for user_id override ======= */
// // type UserFromAPI = {
// //   user_id?: string | number;
// //   first_name: string;
// //   second_name: string;
// //   user_type: string; // "coach" or "athlete"
// //   location?: string | null;
// //   experience_level?: string | null;
// //   email?: string | null;
// //   avatar_url?: string | null;
// // };
// // type UserResp = { data?: UserFromAPI };

// // async function getUserById(id: string | number): Promise<UserFromAPI | undefined> {
// //   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
// //   return data?.data;
// // }

// // const toSafeTitle = (s: string) =>
// //   s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
// // /* ===================================================================== */

// // export default function ProfilePage() {
// //   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
// //   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
// //   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
// //     "overview"
// //   );
// //   const [error, setError] = useState<string | null>(null);

// //   const { userDB } = useGetUser();

// //   /* === ADDED: read ?user_id= and track viewing-other flag === */
// //   const search = useSearchParams();
// //   const userIdParam = search.get("user_id");
// //   const [viewingOther, setViewingOther] = useState(false);
// //   /* ========================================================= */

// //   const shellVars = useMemo(
// //     () =>
// //       ({
// //         "--sb-w": "88px",
// //         "--extra-left": "24px",
// //       } as React.CSSProperties),
// //     []
// //   );

// //   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();

// //   /* ===== ADDED: override when user_id is present (before your original effect) ===== */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       if (!userIdParam) return; // only run when overriding
// //       try {
// //         setViewingOther(true);
// //         setLoading(true);
// //         setError(null);

// //         const u = await getUserById(userIdParam);
// //         if (!u) throw new Error("User not found");

// //         const r = (u.user_type ?? "athlete").toLowerCase();

// //         if (r === "coach") {
// //           const header: CoachProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "Coach",
// //             // Never pass null to avoid your email error; use undefined if missing
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             bio: u.experience_level ?? null,
// //             tags: [],
// //           };

// //           setFetchingCoachPrograms(true);
// //           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
// //           const mapped: CoachProgramItem[] = list.map((p) => ({
// //             id: p.id,
// //             title: p.title,
// //             subscribers: p.subscribers ?? 0,
// //             rating: Number(p.rating ?? 0),
// //           }));

// //           if (cancelled) return;
// //           setCoachVM({
// //             header,
// //             stats: {
// //               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
// //               programs: mapped.length,
// //               rating:
// //                 mapped.length > 0
// //                   ? Math.round(
// //                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) / mapped.length) * 10
// //                     ) / 10
// //                   : 0,
// //               monthly: 0,
// //             },
// //             programs: mapped,
// //             certs: [],
// //           });
// //           setAthleteVM(null);
// //         } else {
// //           const profile: ProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name: toSafeTitle(`${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()) || "User",
// //             email: u.email ?? "", // avoid null
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             goals: u.experience_level ?? null,
// //             experience: u.experience_level ?? null,
// //           };

// //           if (cancelled) return;
// //           setAthleteVM({
// //             user: {
// //               ...profile,
// //               location: profile.location ?? "San Francisco, CA",
// //               joined_at: new Date().toISOString(),
// //               goals: profile.goals ?? "Build muscle, improve strength",
// //               experience: profile.experience ?? "Intermediate",
// //             },
// //             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
// //             achievements: [],
// //             subscriptions: [],
// //           });
// //           setCoachVM(null);
// //         }
// //       } catch (e) {
// //         if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile.");
// //       } finally {
// //         if (!cancelled) {
// //           setFetchingCoachPrograms(false);
// //           setLoading(false);
// //         }
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userIdParam]);
// //   /* ================================================================================ */

// //   /* build base VMs from userDB */
// //   useEffect(() => {
// //     if (userIdParam) return; // ✅ skip self-build when viewing someone else

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       if (!userDB || !("data" in userDB)) {
// //         setLoading(false);
// //         setError("userDB is not ready.");
// //         return;
// //       }

// //       const d: UserDBData = (userDB as UserDBShape).data;
// //       const u: UserDBUser = d.user;

// //       const email = d.email ?? ""; // adjust if you store email elsewhere
// //       const rawFullName =
// //         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
// //         email.split("@")[0] ||
// //         "User";
// //       const fullName = toTitleCase(rawFullName);

// //       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
// //         const header: CoachProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null, // not present in your shape
// //           avatar_url: null, // not present in your shape
// //           bio: u.experience_level || null,
// //           tags: [], // fill if available
// //         };

// //         const coachBlock: CoachBlock = d.coach ?? {};
// //         const seededPrograms: CoachProgramItem[] = Array.isArray(
// //           coachBlock.programs
// //         )
// //           ? coachBlock.programs
// //           : [];
// //         const certs: CertificationItem[] = Array.isArray(
// //           coachBlock.certifications
// //         )
// //           ? coachBlock.certifications
// //           : [];

// //         const vm: CoachVM = {
// //           header,
// //           stats: {
// //             subscribers: coachBlock.subscribers ?? 0,
// //             programs: seededPrograms.length, // will be updated after API call
// //             rating: Number(coachBlock.rating ?? 0),
// //             monthly: coachBlock.monthly_revenue ?? 0,
// //           },
// //           programs: seededPrograms,
// //           certs,
// //         };

// //         setCoachVM(vm);
// //         setAthleteVM(null);
// //       } else {
// //         const profile: ProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: null,
// //           goals: u.experience_level || null, // reuse if desired
// //           experience: u.experience_level || null,
// //         };

// //         const programs: ProgramLite[] = Array.isArray(d.programs)
// //           ? d.programs
// //           : [];
// //         const achievements: Achievement[] = Array.isArray(d.achievements)
// //           ? d.achievements
// //           : [];
// //         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
// //           ? d.subscriptions
// //           : [];

// //         const workouts = Number(d.stats?.workouts ?? 0) || 0;
// //         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

// //         const vm: AthleteVM = {
// //           user: {
// //             ...profile,
// //             location: profile.location ?? "San Francisco, CA",
// //             joined_at: new Date().toISOString(),
// //             goals: profile.goals ?? "Build muscle, improve strength",
// //             experience: profile.experience ?? "Intermediate",
// //           },
// //           stats: {
// //             workouts,
// //             programs: programs.length,
// //             achievements: achievements.length,
// //             day_streak: dayStreak,
// //           },
// //           achievements: achievements
// //             .slice(0, 3)
// //             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
// //           subscriptions: subscriptions.map((s) => ({
// //             ...s,
// //             status: s.status ?? "active",
// //           })),
// //         };

// //         setAthleteVM(vm);
// //         setCoachVM(null);
// //       }
// //     } catch (e) {
// //       setError(
// //         e instanceof Error ? e.message : "Failed to build profile from userDB."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [userDB, userIdParam]);

// //   /* fetch real programs list/count for COACH */
// //   useEffect(() => {
// //     if (userIdParam) return; // ✅ skip self refresh when viewing someone else

// //     const d = (userDB as UserDBShape | undefined)?.data;
// //     if (!d) return;

// //     const isCoachSelf = (d.user.user_type ?? "athlete").toLowerCase() === "coach";
// //     const coachId = resolveUserId(d);
// //     if (!isCoachSelf || coachId === undefined) return;

// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setFetchingCoachPrograms(true);

// //         // If you need auth, read token from localStorage or userDB and pass to helper.
// //         // const token = JSON.parse(localStorage.getItem("user") || "{}")?.data?.access_token as string | undefined;
// //         const token = undefined;

// //         const list = await fetchProgramsByCoachId(coachId, token);
// //         if (cancelled) return;

// //         const mapped: CoachProgramItem[] = list.map((p) => ({
// //           id: p.id,
// //           title: p.title,
// //           subscribers: p.subscribers ?? 0,
// //           rating: Number(p.rating ?? 0),
// //         }));

// //         setCoachVM((prev) =>
// //           prev
// //             ? {
// //                 ...prev,
// //                 stats: { ...prev.stats, programs: mapped.length },
// //                 programs: mapped,
// //               }
// //             : prev
// //         );
// //       } catch {
// //         // optional: surface an error toast
// //       } finally {
// //         if (!cancelled) setFetchingCoachPrograms(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userDB, userIdParam]);

// //   const isCoach = role === "coach";
// //   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach; // ✅ ADDED
// //   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
// //   const {theme} = useGetTheme()
// //   return (
// //     <div className={`min-h-screen${theme === "dark" ? "bg-black": "bg-white"}`}>
// //       <Sidebar />
// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
// //       ></main>

// //       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //         <div className="mx-auto max-w-6xl px-7 pb-24">
// //           <header className="py-4 flex justify-between items-center">
// //             <h1 className="text-4xl font-semibold">Profile</h1>
// //             <ThemeToggle />
// //           </header>

// //           {/* header card */}
// //           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
// //             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8  justify-between items-center mr-5">
// //               <div>
// //                 {showLoading ? (
// //                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
// //                 ) : error ? (
// //                   <div className="text-sm text-red-600">{error}</div>
// //                 ) : displayCoach && coachVM ? (  /* ✅ use displayCoach */
// //                   <CoachHeader data={coachVM.header} />
// //                 ) : athleteVM ? (
// //                   <ProfileHeader data={athleteVM.user} />
// //                 ) : null}
// //               </div>

// //               <div>
// //                 {!viewingOther && (  /* ✅ hide logout when viewing other */
// //                   <button
// //                     className="bg-gradient-to-r  from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={() => {
// //                       window.location.href = "/";
// //                       window.localStorage.removeItem("token");
// //                       window.localStorage.removeItem("user");
// //                     }}
// //                   >
// //                     Logout
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* stats row */}
// //           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
// //             {displayCoach && coachVM ? (   /* ✅ use displayCoach */
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Users className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.subscribers}
// //                   label="Subscribers"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Star className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.rating}
// //                   label="Rating"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.monthly}
// //                   label="Monthly"
// //                 />
// //               </>
// //             ) : athleteVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.workouts}
// //                   label="Workouts"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Award className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.achievements}
// //                   label="Achievements"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Flame className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.day_streak}
// //                   label="Day Streak"
// //                 />
// //               </>
// //             ) : null}
// //           </section>

// //           {/* tabs */}
// //           <section className="mt-5">
// //             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
// //               <button
// //                 onClick={() => setTab("overview")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "overview"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Overview
// //               </button>
// //               <button
// //                 onClick={() => setTab("activity")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "activity"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Activity
// //               </button>
// //               <button
// //                 onClick={() => setTab("settings")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "settings"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Settings
// //               </button>
// //             </div>

// //             <div className="mt-4 space-y-4">
// //               {tab === "overview" &&
// //                 (displayCoach && coachVM ? (   /* ✅ use displayCoach */
// //                   <>
// //                     <CoachProgramsList
// //                       loading={showLoading}
// //                       items={coachVM.programs}
// //                     />
// //                     <CoachCertifications
// //                       loading={showLoading}
// //                       items={coachVM.certs}
// //                     />
// //                   </>
// //                 ) : athleteVM ? (
// //                   <>
// //                     <SubscriptionsList
// //                       loading={showLoading}
// //                       items={athleteVM.subscriptions}
// //                     />
// //                     <RecentAchievements
// //                       loading={showLoading}
// //                       items={athleteVM.achievements}
// //                     />
// //                   </>
// //                 ) : null)}

// //               {tab === "activity" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Activity feed coming soon.
// //                 </div>
// //               )}
// //               {tab === "settings" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Settings UI coming soon.
// //                 </div>
// //               )}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // "use client";

// // import { Suspense, useEffect, useMemo, useState } from "react";
// // import axios from "axios";
// // import {
// //   TrendingUp,
// //   BookOpen,
// //   Award,
// //   Flame,
// //   Users,
// //   DollarSign,
// //   Star,
// // } from "lucide-react";

// // import { useSearchParams, useRouter } from "next/navigation"; // ✅ added useRouter
// // import ThemeToggle from "@/app/components/ThemeToggle";
// // import useGetTheme from "@/app/Hooks/useGetTheme";
// // import useGetUser from "@/app/Hooks/useGetUser";
// // import RecentAchievements from "./AchievementsCard";
// // import CoachCertifications, { CertificationItem } from "./CertificationsCard";
// // import CoachHeader, { CoachProfileCore } from "./CoachHeader";
// // import ProfileHeader, { ProfileCore } from "./ProfileHeader";
// // import CoachProgramsList, { CoachProgramItem } from "./ProgramsListCard";
// // import StatCard from "./StatGrid";
// // import SubscriptionsList from "./SubscriptionsCard";
// // import Sidebar from "@/app/components/shared/sidebar";

// // /* ===== strict types ===== */
// // type ProgramLite = { id: string | number; title: string };
// // type Achievement = {
// //   id: string | number;
// //   title: string;
// //   date?: string;
// //   emoji?: string;
// // };
// // type Subscription = {
// //   id: string | number;
// //   program_title: string;
// //   coach_name?: string;
// //   status?: "active" | "paused" | "expired";
// // };

// // /** this matches the shape you reported in the error */
// // type UserDBUser = {
// //   first_name: string;
// //   second_name: string; // instead of last_name
// //   user_type: "coach" | "athlete" | string;
// //   location: string;
// //   phone: string;
// //   date_of_birth: string;
// //   last_login: string;
// //   experience_level: string; // re-used as "bio"
// //   message: string;
// //   avatar_url?: string;

// //   /* IDs the backend may also send */
// //   user_id?: string | number;
// // };

// // type CoachBlock = {
// //   subscribers?: number;
// //   monthly_revenue?: number;
// //   rating?: number;
// //   certifications?: CertificationItem[];
// //   programs?: CoachProgramItem[];
// // };

// // type UserDBData = {
// //   user: UserDBUser;
// //   email?: string; // if you store it at the root
// //   user_id?: string | number; // optional root fallback id

// //   /* athlete bits */
// //   programs?: ProgramLite[];
// //   achievements?: Achievement[];
// //   subscriptions?: Subscription[];
// //   stats?: { workouts?: number; day_streak?: number };

// //   /* optional coach extras */
// //   coach?: CoachBlock;
// // };

// // type UserDBShape = { data: UserDBData };

// // /* view models */
// // type AthleteVM = {
// //   user: ProfileCore;
// //   stats: {
// //     workouts: number;
// //     programs: number;
// //     achievements: number;
// //     day_streak: number;
// //   };
// //   achievements: Achievement[];
// //   subscriptions: Subscription[];
// // };

// // type CoachVM = {
// //   header: CoachProfileCore;
// //   stats: {
// //     subscribers: number;
// //     programs: number;
// //     rating: number;
// //     monthly: number;
// //   };
// //   programs: CoachProgramItem[];
// //   certs: CertificationItem[];
// // };

// // /* ===== API config & helper ===== */
// // const API_BASE =
// //   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
// //     | string
// //     | undefined) ?? "http://127.0.0.1:4000/api/v1";

// // type ProgramFromAPI = {
// //   id: string | number;
// //   title: string;
// //   subscribers?: number;
// //   rating?: number;
// // };

// // async function fetchProgramsByCoachId(
// //   coachId: string | number,
// //   token?: string
// // ): Promise<ProgramFromAPI[]> {
// //   const url = `${API_BASE}/programs/programCoach/${coachId}`;
// //   const res = await axios.get(
// //     url,
// //     token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
// //   );
// //   const raw = res?.data?.data;
// //   return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
// // }

// // /* ===== helpers ===== */
// // const toTitleCase = (s: string): string =>
// //   s
// //     .trim()
// //     .split(/\s+/)
// //     .map((part) =>
// //       part
// //         .split(/([-'])/)
// //         .map((seg) =>
// //           seg === "-" || seg === "'"
// //             ? seg
// //             : seg
// //             ? seg[0].toUpperCase() + seg.slice(1).toLowerCase()
// //             : seg
// //         )
// //         .join("")
// //     )
// //     .join(" ");

// // function resolveUserId(d: UserDBData): string | number | undefined {
// //   return d.user.user_id ?? d.user_id;
// // }

// // /* ======= minimal API types + fetcher for user_id override ======= */
// // type UserFromAPI = {
// //   user_id?: string | number;
// //   first_name: string;
// //   second_name: string;
// //   user_type: string; // "coach" or "athlete"
// //   location?: string | null;
// //   experience_level?: string | null;
// //   email?: string | null;
// //   avatar_url?: string | null;
// // };
// // type UserResp = { data?: UserFromAPI };

// // async function getUserById(
// //   id: string | number
// // ): Promise<UserFromAPI | undefined> {
// //   const { data } = await axios.get<UserResp>(`${API_BASE}/auth/getusers/${id}`);
// //   return data?.data;
// // }

// // const toSafeTitle = (s: string) =>
// //   s
// //     .trim()
// //     .replace(/\s+/g, " ")
// //     .replace(/\b\w/g, (m) => m.toUpperCase());

// // export default function ProfilePage() {
// //   const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
// //   const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);
// //   const [tab, setTab] = useState<"overview" | "activity" | "settings">(
// //     "overview"
// //   );
// //   const [error, setError] = useState<string | null>(null);

// //   const { userDB } = useGetUser();

// //   /* === read ?user_id= and track viewing-other flag === */
// //   const search = useSearchParams();
// //   const userIdParam = search.get("user_id");
// //   const [viewingOther, setViewingOther] = useState(false);

// //   // ✅ sync viewingOther with URL & clear stale state when returning to self
// //   useEffect(() => {
// //     const other = Boolean(userIdParam);
// //     setViewingOther(other);

// //     if (!other) {
// //       setCoachVM(null);
// //       setAthleteVM(null);
// //       setError(null);
// //     }
// //   }, [userIdParam]);

// //   const shellVars = useMemo(
// //     () =>
// //       ({
// //         "--sb-w": "88px",
// //         "--extra-left": "24px",
// //       } as React.CSSProperties),
// //     []
// //   );

// //   const role = (userDB?.data?.user?.user_type ?? "athlete").toLowerCase();
// //   const router = useRouter(); // ✅ for Back

// //   // ✅ Back handler with safe fallback if no history stack
// //   const handleBack = () => {
// //     if (typeof window !== "undefined" && window.history.length > 1) {
// //       router.back();
// //     } else {
// //       // choose a sensible fallback — programs is a common source of “View Profile”
// //       router.push("/programs");
// //     }
// //   };

// //   /* ===== override when user_id is present (other user's profile) ===== */
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       console.log("hi");
// //       if (!userIdParam) return;
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         const u = await getUserById(userIdParam);
// //         console.log("current user: ", u);
// //         if (!u) throw new Error("User not found");

// //         const r = (u.user_type ?? "athlete").toLowerCase();

// //         if (r === "coach") {
// //           const header: CoachProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name:
// //               toSafeTitle(
// //                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
// //               ) || "Coach",
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             bio: u.experience_level ?? null,
// //             tags: [],
// //           };

// //           setFetchingCoachPrograms(true);
// //           const list = await fetchProgramsByCoachId(u.user_id ?? userIdParam);
// //           const mapped: CoachProgramItem[] = list.map((p) => ({
// //             id: p.id,
// //             title: p.title,
// //             subscribers: p.subscribers ?? 0,
// //             rating: Number(p.rating ?? 0),
// //           }));

// //           if (cancelled) return;
// //           setCoachVM({
// //             header,
// //             stats: {
// //               subscribers: mapped.reduce((a, b) => a + (b.subscribers ?? 0), 0),
// //               programs: mapped.length,
// //               rating:
// //                 mapped.length > 0
// //                   ? Math.round(
// //                       (mapped.reduce((a, b) => a + (b.rating ?? 0), 0) /
// //                         mapped.length) *
// //                         10
// //                     ) / 10
// //                   : 0,
// //               monthly: 0,
// //             },
// //             programs: mapped,
// //             certs: [],
// //           });
// //           setAthleteVM(null);
// //         } else {
// //           const profile: ProfileCore = {
// //             id: u.user_id ?? userIdParam,
// //             name:
// //               toSafeTitle(
// //                 `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim()
// //               ) || "User",
// //             email: u.email ?? "",
// //             location: u.location ?? null,
// //             joined_at: null,
// //             avatar_url: u.avatar_url ?? null,
// //             goals: u.experience_level ?? null,
// //             experience: u.experience_level ?? null,
// //           };

// //           if (cancelled) return;
// //           setAthleteVM({
// //             user: {
// //               ...profile,
// //               location: profile.location ?? "San Francisco, CA",
// //               joined_at: new Date().toISOString(),
// //               goals: profile.goals ?? "Build muscle, improve strength",
// //               experience: profile.experience ?? "Intermediate",
// //             },
// //             stats: { workouts: 0, programs: 0, achievements: 0, day_streak: 0 },
// //             achievements: [],
// //             subscriptions: [],
// //           });
// //           setCoachVM(null);
// //         }
// //       } catch (e) {
// //         if (!cancelled)
// //           setError(e instanceof Error ? e.message : "Failed to load profile.");
// //       } finally {
// //         if (!cancelled) {
// //           setFetchingCoachPrograms(false);
// //           setLoading(false);
// //         }
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userIdParam]);

// //   /* build base VMs from userDB (self) */
// //   useEffect(() => {
// //     if (userIdParam) return;

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       if (!userDB || !("data" in userDB)) {
// //         setLoading(false);
// //         setError("userDB is not ready.");
// //         return;
// //       }

// //       const d: UserDBData = (userDB as UserDBShape).data;
// //       const u: UserDBUser = d.user;

// //       const email = d.email ?? "";
// //       const rawFullName =
// //         `${u.first_name ?? ""} ${u.second_name ?? ""}`.trim() ||
// //         email.split("@")[0] ||
// //         "User";
// //       const fullName = toTitleCase(rawFullName);

// //       if ((u.user_type ?? "athlete").toLowerCase() === "coach") {
// //         const header: CoachProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: null,
// //           bio: u.experience_level || null,
// //           tags: [],
// //         };

// //         const coachBlock: CoachBlock = d.coach ?? {};
// //         const seededPrograms: CoachProgramItem[] = Array.isArray(
// //           coachBlock.programs
// //         )
// //           ? coachBlock.programs
// //           : [];
// //         const certs: CertificationItem[] = Array.isArray(
// //           coachBlock.certifications
// //         )
// //           ? coachBlock.certifications
// //           : [];

// //         const vm: CoachVM = {
// //           header,
// //           stats: {
// //             subscribers: coachBlock.subscribers ?? 0,
// //             programs: seededPrograms.length,
// //             rating: Number(coachBlock.rating ?? 0),
// //             monthly: coachBlock.monthly_revenue ?? 0,
// //           },
// //           programs: seededPrograms,
// //           certs,
// //         };

// //         setCoachVM(vm);
// //         setAthleteVM(null);
// //       } else {
// //         const profile: ProfileCore = {
// //           id: resolveUserId(d) ?? "me",
// //           name: fullName,
// //           email,
// //           location: u.location || null,
// //           joined_at: null,
// //           avatar_url: u.avatar_url,
// //           goals: u.experience_level || null, // reuse if desired

// //           experience: u.experience_level || null,
// //         };

// //         const programs: ProgramLite[] = Array.isArray(d.programs)
// //           ? d.programs
// //           : [];
// //         const achievements: Achievement[] = Array.isArray(d.achievements)
// //           ? d.achievements
// //           : [];
// //         const subscriptions: Subscription[] = Array.isArray(d.subscriptions)
// //           ? d.subscriptions
// //           : [];

// //         const workouts = Number(d.stats?.workouts ?? 0) || 0;
// //         const dayStreak = Number(d.stats?.day_streak ?? 0) || 0;

// //         const vm: AthleteVM = {
// //           user: {
// //             ...profile,
// //             location: profile.location ?? "San Francisco, CA",
// //             joined_at: new Date().toISOString(),
// //             goals: profile.goals ?? "Build muscle, improve strength",
// //             experience: profile.experience ?? "Intermediate",
// //           },
// //           stats: {
// //             workouts,
// //             programs: programs.length,
// //             achievements: achievements.length,
// //             day_streak: dayStreak,
// //           },
// //           achievements: achievements
// //             .slice(0, 3)
// //             .map((a) => ({ ...a, emoji: a.emoji ?? "💪" })),
// //           subscriptions: subscriptions.map((s) => ({
// //             ...s,
// //             status: s.status ?? "active",
// //           })),
// //         };

// //         setAthleteVM(vm);
// //         setCoachVM(null);
// //       }
// //     } catch (e) {
// //       setError(
// //         e instanceof Error ? e.message : "Failed to build profile from userDB."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [userDB, userIdParam]);

// //   /* fetch real programs list/count for COACH (self only) */
// //   useEffect(() => {
// //     if (userIdParam) return;

// //     const d = (userDB as UserDBShape | undefined)?.data;
// //     if (!d) return;

// //     const isCoachSelf =
// //       (d.user.user_type ?? "athlete").toLowerCase() === "coach";
// //     const coachId = resolveUserId(d);
// //     if (!isCoachSelf || coachId === undefined) return;

// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setFetchingCoachPrograms(true);

// //         const token = undefined; // add if needed

// //         const list = await fetchProgramsByCoachId(coachId, token);
// //         if (cancelled) return;

// //         const mapped: CoachProgramItem[] = list.map((p) => ({
// //           id: p.id,
// //           title: p.title,
// //           subscribers: p.subscribers ?? 0,
// //           rating: Number(p.rating ?? 0),
// //         }));

// //         setCoachVM((prev) =>
// //           prev
// //             ? {
// //                 ...prev,
// //                 stats: { ...prev.stats, programs: mapped.length },
// //                 programs: mapped,
// //               }
// //             : prev
// //         );
// //       } catch {
// //         // optional: toast
// //       } finally {
// //         if (!cancelled) setFetchingCoachPrograms(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [userDB, userIdParam]);

// //   const isCoach = role === "coach";

// //   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach;
// //   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
// //   const { theme } = useGetTheme();

// //   return (
// //     <div
// //       className={`min-h-screen${theme === "dark" ? "bg-black" : "bg-white"}`}
// //     >
// //       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
// //         <Sidebar />
// //       </Suspense>
// //       <main
// //         style={shellVars}
// //         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
// //       ></main>

// //       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
// //         <div className="mx-auto max-w-6xl px-7 pb-24">
// //           <header className="py-4 flex justify-between items-center">
// //             <h1 className="text-4xl font-semibold">Profile</h1>
// //             <ThemeToggle />
// //           </header>

// //           {/* header card */}
// //           <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
// //             <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-8 justify-between items-center mr-5">
// //               <div>
// //                 {showLoading ? (
// //                   <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
// //                 ) : error ? (
// //                   <div className="text-sm text-red-600">{error}</div>
// //                 ) : displayCoach && coachVM ? (
// //                   <CoachHeader data={coachVM.header} />
// //                 ) : athleteVM ? (
// //                   <ProfileHeader data={athleteVM.user} />
// //                 ) : null}
// //               </div>

// //               <div className="flex gap-3">
// //                 {/* Show Back when viewing other, otherwise show Logout */}
// //                 {viewingOther ? (
// //                   <button
// //                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={handleBack}
// //                   >
// //                     Back
// //                   </button>
// //                 ) : (
// //                   <button
// //                     className="bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-6 cursor-pointer py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl"
// //                     onClick={() => {
// //                       window.location.href = "/";
// //                       window.localStorage.removeItem("token");
// //                       window.localStorage.removeItem("user");
// //                     }}
// //                   >
// //                     Logout
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </section>

// //           {/* stats row */}
// //           <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
// //             {displayCoach && coachVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Users className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.subscribers}
// //                   label="Subscribers"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Star className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.rating}
// //                   label="Rating"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<DollarSign className="h-5 w-5 text-red-600" />}
// //                   value={coachVM.stats.monthly}
// //                   label="Monthly"
// //                 />
// //               </>
// //             ) : athleteVM ? (
// //               <>
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<TrendingUp className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.workouts}
// //                   label="Workouts"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<BookOpen className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.programs}
// //                   label="Programs"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Award className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.achievements}
// //                   label="Achievements"
// //                 />
// //                 <StatCard
// //                   loading={showLoading}
// //                   icon={<Flame className="h-5 w-5 text-red-600" />}
// //                   value={athleteVM.stats.day_streak}
// //                   label="Day Streak"
// //                 />
// //               </>
// //             ) : null}
// //           </section>

// //           {/* tabs */}
// //           <section className="mt-5">
// //             <div className="flex gap-2 rounded-full bg-zinc-100 p-1 text-sm">
// //               <button
// //                 onClick={() => setTab("overview")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "overview"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Overview
// //               </button>
// //               <button
// //                 onClick={() => setTab("activity")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "activity"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Activity
// //               </button>
// //               <button
// //                 onClick={() => setTab("settings")}
// //                 className={`flex-1 rounded-full px-4 py-2 ${
// //                   tab === "settings"
// //                     ? "bg-white shadow text-zinc-900"
// //                     : "text-zinc-600"
// //                 }`}
// //               >
// //                 Settings
// //               </button>
// //             </div>

// //             <div className="mt-4 space-y-4">
// //               {tab === "overview" &&
// //                 (displayCoach && coachVM ? (
// //                   <>
// //                     <CoachProgramsList
// //                       loading={showLoading}
// //                       items={coachVM.programs}
// //                     />
// //                     <CoachCertifications
// //                       loading={showLoading}
// //                       items={coachVM.certs}
// //                     />
// //                   </>
// //                 ) : athleteVM ? (
// //                   <>
// //                     <SubscriptionsList
// //                       loading={showLoading}
// //                       items={athleteVM.subscriptions}
// //                     />
// //                     <RecentAchievements
// //                       loading={showLoading}
// //                       items={athleteVM.achievements}
// //                     />
// //                   </>
// //                 ) : null)}

// //               {tab === "activity" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Activity feed coming soon.
// //                 </div>
// //               )}
// //               {tab === "settings" && (
// //                 <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
// //                   Settings UI coming soon.
// //                 </div>
// //               )}
// //             </div>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


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

// import { useSearchParams, useRouter } from "next/navigation";
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
// import {
//   GetProgramsByCoachId,
//   ProgramFromAPI,
// } from "@/app/programs/services/addProgram.service";
// import {
//   getSubscriptionsByAthleteId,
//   type AthleteSubscription,
// } from "@/app/services/subscription.service";
// import { Program } from "@/app/types/type";

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

// type UserDBUser = {
//   first_name: string;
//   second_name: string;
//   user_type: "coach" | "athlete" | string;
//   location: string;
//   phone: string;
//   date_of_birth: string;
//   last_login: string;
//   experience_level: string;
//   message: string;
//   avatar_url?: string;
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
//   email?: string;
//   user_id?: string | number;
//   programs?: ProgramLite[];
//   achievements?: Achievement[];
//   subscriptions?: Subscription[];
//   stats?: { workouts?: number; day_streak?: number };
//   coach?: CoachBlock;
// };

// type UserDBShape = { data: UserDBData };

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
//     | undefined) ?? "https://godzilla-be.vercel.app/api/v1";

// /* this stays just for the user lookup */
// type UserFromAPI = {
//   user_id?: string | number;
//   first_name: string;
//   second_name: string;
//   user_type: string;
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

// /* thin wrapper that uses the service */
// async function fetchProgramsByCoachId(
//   coachId: string | number
// ): Promise<ProgramFromAPI[]> {
//   return GetProgramsByCoachId(coachId);
// }

// /* ===== subscriptions API helper (athlete) ===== */

// type AthleteSubRow = {
//   id: string | number;
//   programs?: {
//     title?: string;
//     // if you joined coach user inside programs, it might be here:
//     users?: { first_name?: string } | null;
//   } | null;
//   // root users is the athlete himself
//   users?: { first_name?: string } | null;
// };

// async function fetchSubscriptionsForAthlete(
//   athleteId: string | number
// ): Promise<Subscription[]> {
//   try {
//     const { data } = await axios.get(`${API_BASE}/subscripe/${athleteId}`);
//     const rows: AthleteSubRow[] = Array.isArray(data?.data) ? data.data : [];

//     return rows.map((row) => ({
//       id: row.id,
//       program_title: row.programs?.title ?? "Program",
//       // prefer coach name from programs.users if you have that relation set up;
//       // otherwise this will just be undefined.
//       coach_name: row.programs?.users?.first_name ?? undefined,
//       status: "active",
//     }));
//   } catch (e) {
//     console.error("Failed to fetch athlete subscriptions", e);
//     return [];
//   }
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

//   const [subscripeProgram, setSubscripeProgram] = useState<
//     AthleteSubscription[]
//   >([]);

//   const { userDB } = useGetUser();

//   const search = useSearchParams();
//   const userIdParam = search.get("user_id");
//   const [viewingOther, setViewingOther] = useState(false);

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
//   const router = useRouter();

//   const handleBack = () => {
//     if (typeof window !== "undefined" && window.history.length > 1) {
//       router.back();
//     } else {
//       router.push("/programs");
//     }
//   };

//   useEffect(() => {
//     const fetchGetSubscripeProgram = async () => {
//       const data = await getSubscriptionsByAthleteId(
//         userDB?.data.user_id as string
//       );
//       setSubscripeProgram(data);
//     };
//     fetchGetSubscripeProgram();
//   }, [userDB?.data.user_id]);

//   /* ===== when viewing another user's profile via ?user_id= ===== */
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!userIdParam) return;
//       try {
//         setLoading(true);
//         setError(null);

//         const u = await getUserById(userIdParam);
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
//             subscriptions: [], // will be filled by subscriptions effect
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

//   /* ===== build base VMs from userDB when viewing self ===== */
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
//           goals: u.experience_level || null,
//           experience: u.experience_level || null,
//         };

//         const programs: ProgramLite[] = Array.isArray(d.programs)
//           ? d.programs
//           : [];
//         const achievements: Achievement[] = Array.isArray(d.achievements)
//           ? d.achievements
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
//           subscriptions: [], // will be filled by subscriptions effect
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

//   /* ===== fetch real programs (list + count) for logged-in coach ===== */
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

//         const list = await fetchProgramsByCoachId(coachId);
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
//         // optional toast
//       } finally {
//         if (!cancelled) setFetchingCoachPrograms(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [userDB, userIdParam]);

//   /* ===== fetch real subscriptions for athlete (self OR other) ===== */

//   const loggedInAthleteId = (userDB as UserDBShape | undefined)?.data?.user_id;
//   const athleteIdToLoad = userIdParam ?? loggedInAthleteId;

//   useEffect(() => {
//     // only for athletes
//     const isAthleteRole = (userDB?.data?.user?.user_type ?? "athlete")
//       .toLowerCase()
//       .includes("athlete");

//     if (!isAthleteRole) return;
//     if (!athleteIdToLoad) return;


//     let cancelled = false;
//     (async () => {
//       const subs = await fetchSubscriptionsForAthlete(athleteIdToLoad);
//       if (cancelled) return;

//       setAthleteVM((prev) =>
//         prev
//           ? {
//               ...prev,
//               subscriptions: subs.map((s) => ({
//                 ...s,
//                 status: s.status ?? "active",
//               })),
//             }
//           : prev
//       );
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [athleteIdToLoad, userDB?.data?.user?.user_type]);

//   const isCoach = role === "coach";
//   const displayCoach = viewingOther ? Boolean(coachVM) : isCoach;
//   const showLoading = loading || (displayCoach && fetchingCoachPrograms);
//   const { theme } = useGetTheme();

//   return (
//     <div className="min-h-screen">
//       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
//         <Sidebar />
//       </Suspense>
//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//       >
//         <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-0 py-4 sm:py-6 md:py-8">
//           <div className="mx-auto w-full max-w-6xl px-0 sm:px-4 md:px-6 lg:px-0 pb-24">
//             {/* header */}
//             <header className="py-3 sm:py-4 flex items-center justify-between gap-3">
//               <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
//                 Profile
//               </h1>
//               <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
//                 <ThemeToggle />
//               </div>
//             </header>

//             {/* header card */}
//             <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
//               <div className="flex max-sm:flex-col max-sm:items-start max-sm:gap-4 justify-between items-center sm:mr-5">
//                 <div className="w-full">
//                   {showLoading ? (
//                     <div className="h-24 sm:h-28 animate-pulse rounded-xl bg-zinc-200" />
//                   ) : error ? (
//                     <div className="text-sm text-red-600">{error}</div>
//                   ) : displayCoach && coachVM ? (
//                     <CoachHeader data={coachVM.header} />
//                   ) : athleteVM ? (
//                     <ProfileHeader data={athleteVM.user} />
//                   ) : null}
//                 </div>

//                 <div className="mt-4 sm:mt-0 flex w-full sm:w-auto justify-stretch sm:justify-end">
//                   {viewingOther ? (
//                     <button
//                       className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
//                       onClick={handleBack}
//                     >
//                       Back
//                     </button>
//                   ) : (
//                     <>
//                       <div className="flex gap-4">
//                         <button
//                           className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
//                           onClick={() => {
//                             window.location.href = "/";
//                             window.localStorage.removeItem("token");
//                             window.localStorage.removeItem("user");
//                           }}
//                         >
//                           Logout
//                         </button>
//                         <button
//                           onClick={() => router.push("/profile/edit")}
//                           className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 cursor-pointer py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </section>

//             {/* stats row */}
//             <section className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
//               {displayCoach && coachVM ? (
//                 <>
//                   <StatCard
//                     loading={showLoading}
//                     icon={<Users className="h-5 w-5 text-red-600" />}
//                     value={coachVM.stats.subscribers}
//                     label="Subscribers"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                     value={coachVM.stats.programs}
//                     label="Programs"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<Star className="h-5 w-5 text-red-600" />}
//                     value={coachVM.stats.rating}
//                     label="Rating"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<DollarSign className="h-5 w-5 text-red-600" />}
//                     value={coachVM.stats.monthly}
//                     label="Monthly"
//                   />
//                 </>
//               ) : athleteVM ? (
//                 <>
//                   <StatCard
//                     loading={showLoading}
//                     icon={<TrendingUp className="h-5 w-5 text-red-600" />}
//                     value={athleteVM.stats.workouts}
//                     label="Workouts"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<BookOpen className="h-5 w-5 text-red-600" />}
//                     value={subscripeProgram.length}
//                     label="Subscribed Programs"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<Award className="h-5 w-5 text-red-600" />}
//                     value={athleteVM.stats.achievements}
//                     label="Achievements"
//                   />
//                   <StatCard
//                     loading={showLoading}
//                     icon={<Flame className="h-5 w-5 text-red-600" />}
//                     value={athleteVM.stats.day_streak}
//                     label="Day Streak"
//                   />
//                 </>
//               ) : null}
//             </section>

//             {/* tabs */}
//             <section className="mt-5">
//               <div className="flex gap-1 sm:gap-2 rounded-full bg-zinc-100 p-1 text-xs sm:text-sm">
//                 <button
//                   onClick={() => setTab("overview")}
//                   className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
//                     tab === "overview"
//                       ? "bg-white shadow text-zinc-900"
//                       : "text-zinc-600"
//                   }`}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => setTab("activity")}
//                   className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
//                     tab === "activity"
//                       ? "bg-white shadow text-zinc-900"
//                       : "text-zinc-600"
//                   }`}
//                 >
//                   Activity
//                 </button>
//                 <button
//                   onClick={() => setTab("settings")}
//                   className={`flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 ${
//                     tab === "settings"
//                       ? "bg-white shadow text-zinc-900"
//                       : "text-zinc-600"
//                   }`}
//                 >
//                   Settings
//                 </button>
//               </div>

//               <div className="mt-4 space-y-4">
//                 {tab === "overview" &&
//                   (displayCoach && coachVM ? (
//                     <>
//                       <CoachProgramsList
//                         loading={showLoading}
//                         items={coachVM.programs}
//                       />
//                       <CoachCertifications
//                         loading={showLoading}
//                         items={coachVM.certs}
//                       />
//                     </>
//                   ) : athleteVM ? (
//                     <>
//                       <SubscriptionsList
//                         loading={showLoading}
//                         items={athleteVM.subscriptions}
//                       />
//                       <RecentAchievements
//                         loading={showLoading}
//                         items={athleteVM.achievements}
//                       />
//                     </>
//                   ) : null)}

//                 {tab === "activity" && (
//                   <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
//                     Activity feed coming soon.
//                   </div>
//                 )}
//                 {tab === "settings" && (
//                   <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
//                     Settings UI coming soon.
//                   </div>
//                 )}
//               </div>
//             </section>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  BookOpen,
  Award,
  Flame,
  Users as UsersIcon,
  DollarSign,
  Star,
  Users, // just to make TS happy in case of name clashes
} from "lucide-react";

import {
  TrendingUp as TrendingUpIcon,
  BookOpen as BookOpenIcon,
  Award as AwardIcon,
  Flame as FlameIcon,
  Users as UsersLucide,
  DollarSign as DollarSignIcon,
  Star as StarLucide,
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
import { useShareModal } from "@/app/community/context/ShareModal.context";
import ShareModal from "@/app/components/shared/ShareModal";

/// imports from HOME
import { FaBell } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { TbTrophy } from "react-icons/tb";
import { ReactNode } from "react";
import ProgramCard from "@/app/components/shared/programCard";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import Link from "next/link";

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

/* ===== HOME types ===== */

type DashboardProgram = {
  id: string | number;
  title: string;
  coachName: string;
};

type ChatMessage = {
  id: number | string;
  user: string;
  avatar: string;
  time: string;
  content: string;
  sender_id: string;
  likes: number;
  replies: number;
  created_at: string;
  conversation_id?: string;
};

type LiteUser = { id: string; name: string; status: string; avatar: string };

/* small stat card used only in Infos tab */
function DashboardStatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center">
      <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
        {icon}
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

/* ===== API config & helper ===== */
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as
    | string
    | undefined) ?? "https://godzilla-be.vercel.app/api/v1";

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
  const { data } = await axios.get<UserResp>(
    `https://godzilla-be.vercel.app/api/v1/auth/getuserbyusername/${id}`
  );
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

/* ===== main component ===== */

export default function ProfilePage() {
  /* ---------- PROFILE VMs ---------- */
  const [athleteVM, setAthleteVM] = useState<AthleteVM | null>(null);
  const [coachVM, setCoachVM] = useState<CoachVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingCoachPrograms, setFetchingCoachPrograms] = useState(false);


  // top-level tabs: PROFILE / INFOS
  const [tab, setTab] = useState<"profile" | "infos">("infos");

  const [error, setError] = useState<string | null>(null);
  const [subscripeProgram, setSubscripeProgram] = useState<
    AthleteSubscription[]
  >([]);

  const { userDB } = useGetUser();
  const { theme } = useGetTheme();
  const loggedInData = (userDB as UserDBShape | undefined)?.data;
  const loggedInUser = loggedInData?.user;

  const readOnlyInputClass =
  "w-full rounded-lg px-3 py-2 text-sm cursor-not-allowed border " +
  (theme === "dark"
    ? "bg-[#18181b] border-[#27272a] text-gray-100 placeholder:text-gray-500"
    : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400");

  const search = useSearchParams();
  const userIdParam = search.get("user_id");
  const [viewingOther, setViewingOther] = useState(false);

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const router = useRouter();

  const role =
    (userDB?.data?.user?.user_type as string | undefined)?.toLowerCase() ??
    "athlete";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/programs");
    }
  };

  useEffect(() => {
    const other = Boolean(userIdParam);
    setViewingOther(other);

    if (!other) {
      setCoachVM(null);
      setAthleteVM(null);
      setError(null);
    }
  }, [userIdParam]);

  useEffect(() => {
    const fetchGetSubscripeProgram = async () => {
      const data = await getSubscriptionsByAthleteId(
        userDB?.data.user_id as string
      );
      setSubscripeProgram(data);
    };
    if (userDB?.data.user_id) fetchGetSubscripeProgram();
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
                `${u.first_name ?? ""} ${u.second_name ?? ""}.trim()`
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
                `${u.first_name ?? ""} ${u.second_name ?? ""}.trim()`
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
        `${u.first_name ?? ""} ${u.second_name ?? ""}.trim()` ||
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

  /* ------------------------------------------------------------------ */
  /*                    HOME / INFOS TAB STATE + LOGIC                  */
  /* ------------------------------------------------------------------ */

  // programs & chat stuff for Infos tab
  const [programs, setPrograms] = useState<DashboardProgram[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeUsers, setActiveUsers] = useState<LiteUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [homeError, setHomeError] = useState("");
  const [notification, setNotification] = useState<{
    user: LiteUser;
    message: ChatMessage;
  } | null>(null);

  const [sender_id, setSenderId] = useState<string>();
  const [conversations, setConversations] = useState<string[]>([]);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  function extractTextFromHTML(html: string) {
    if (!html) return "";
    if (typeof document === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setHomeError("");

      const res = await fetch(
        "https://godzilla-be.vercel.app/api/v1/auth/getusers"
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const result = await res.json();
      if (!result || !result.data) throw new Error("Invalid response format");

      const formattedUsers: LiteUser[] = result.data
        .map(
          (user: {
            id: string;
            first_name: string;
            status: string;
            avatar_url: string;
          }) => ({
            id: user.id,
            name: user.first_name || "Unknown",
            status: user.status || "online",
            avatar:
              user.avatar_url ||
              user.first_name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") ||
              "U",
          })
        )
        .filter(
          (user: { id: string }) => user.id !== userDB?.data?.user_id
        )
        .sort((a: { status: string }, b: { status: string }) => {
          if (a.status === "online") return -1;
          if (a.status !== "online") return 1;
          return 0;
        });

      setActiveUsers(formattedUsers);
    } catch (err) {
      console.error(err);
      setHomeError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userDB?.data?.user_id) fetchUsers();
  }, [userDB?.data?.user_id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!sender_id) return;
      await getUserById(sender_id);
    };

    if (sender_id) fetchUser();
  }, [sender_id]);

  // fetch conversations
  useEffect(() => {
    if (!userDB?.data?.user_id) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          "https://godzilla-be.vercel.app/api/v1/chat/conversations",
          {
            headers: { Authorization: `Bearer ${userDB?.data.access_token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();
        const convIds = data.data.map((conv: { id: string }) => conv.id);
        setConversations(convIds);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };

    fetchConversations();
  }, [userDB?.data?.user_id, userDB?.data.access_token]);

  // subscribe to realtime chats
  useEffect(() => {
    if (conversations.length === 0 || !userDB?.data?.user_id) return;

    channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
    channelsRef.current = [];

    conversations.forEach((convId) => {
      const channel = supabase
        .channel(`chat-${convId}`)
        .on("broadcast", { event: "new-message" }, (payload) => {
          const newMessage = payload.payload as ChatMessage;
          if (newMessage.sender_id === userDB?.data?.user_id) return;

          setSenderId(newMessage.sender_id);
          const sender = activeUsers.find((u) => u.id === newMessage.sender_id);
          if (sender) {
            setNotification({ user: sender, message: newMessage });
            setTimeout(() => setNotification(null), 3000);
          }

          setChats((prev) => {
            const key = newMessage.sender_id;
            const list = prev[key] || [];
            if (list.some((m) => m.id === newMessage.id)) return prev;

            return { ...prev, [key]: [...list, newMessage] };
          });
        })
        .subscribe();

      channelsRef.current.push(channel);
    });

    return () => {
      channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
      channelsRef.current = [];
    };
  }, [conversations, userDB?.data?.user_id, activeUsers]);

  const userId = userDB?.data?.user_id;

  // fetch programs for Infos tab
  useEffect(() => {
    if (!userId) return;

    const fetchPrograms = async () => {
      try {
        setIsLoadingPrograms(true);

        if (role === "coach") {
          const list = await GetProgramsByCoachId(userId as string | number);

          const mapped: DashboardProgram[] = Array.isArray(list)
          ? list
              .filter(
                (obj: ProgramFromAPI | null): obj is ProgramFromAPI =>
                  obj !== null &&
                  typeof obj === "object" &&
                  (typeof obj.id === "string" || typeof obj.id === "number") &&
                  typeof obj.title === "string"
              )
              .map((p) => ({
                id: p.id,
                title: p.title,
                coachName: userDB?.data?.user.first_name ?? "Coach",
              }))
          : [];
        

          setPrograms(mapped);
        } else {
          const response = await axios.get(
            `https://godzilla-be.vercel.app/api/v1/subscripe/${userId}`
          );

          type Row = {
            id?: string | number;
            program_id?: string | number;
            programs?: {
              id?: string | number;
              title?: string;
              coach_id?: string | number;
              cover_image_url?: string | null;
              users?: { first_name?: string | null } | null; // coach
            } | null;
            users?: { first_name?: string | null } | null; // athlete
          };

          const raw = response.data?.data as Row[] | undefined;

          const mapped: DashboardProgram[] = Array.isArray(raw)
            ? raw.map((row, idx) => ({
                id: row.programs?.id ?? row.program_id ?? row.id ?? `${idx}`,
                title: row.programs?.title ?? "Program",
                coachName: row.programs?.users?.first_name ?? "Coach",
              }))
            : [];

          setPrograms(mapped);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setPrograms([]);
          } else {
            console.error(
              "❌ Axios error fetching programs:",
              err.response?.data || err.message
            );
          }
        } else if (err instanceof Error) {
          console.error("❌ Error fetching programs:", err.message);
        } else {
          console.error("❌ Unknown error:", err);
        }
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    void fetchPrograms();
  }, [userId, role, userDB?.data?.user.first_name]);

  /* ----------------------------- RENDER ----------------------------- */

  const { openShareModal, toggleShareModal } = useShareModal();

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
              <h1 className="text-2xl sm:text-3xl  md:text-4xl font-semibold">
                Profile
              </h1>
              <div className="flex gap-2  sm:gap-3 w-full sm:w-auto justify-end">
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
                    <>
                      <div className="flex gap-4 w-full flex-wrap sm:flex-nowrap">
                        <button
                          className="flex items-center cursor-pointer justify-center w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                          onClick={() => {
                            window.location.href = "/";
                            window.localStorage.removeItem("token");
                            window.localStorage.removeItem("user");
                          }}
                        >
                          Logout
                        </button>

                        <button
                          onClick={() => router.push("/profile/edit")}
                          className="flex items-center justify-center cursor-pointer w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                        >
                          Edit
                        </button>

                        <button
                          onClick={toggleShareModal}
                          className="flex items-center justify-center cursor-pointer w-full sm:w-auto bg-gradient-to-r from-rose-500 to-red-400 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                        >
                          Share profile
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>


            {openShareModal && (
              <ShareModal
                message={`https://godzilla-fe.vercel.app/profile?user_id=${
                  userIdParam ?? userDB?.data.user.username
                }`}
              />
            )}

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
                  onClick={() => setTab("infos")}
                  className={`flex-1 rounded-full px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 ${
                    tab === "infos"

                      ? "bg-white shadow text-zinc-900"
                      : "text-zinc-600"
                  }`}
                >
                  Your Info
                </button>
              
                <button
                  onClick={() => setTab("profile")}
                  className={`flex-1 rounded-full px-3 cursor-pointer sm:px-4 py-1.5 sm:py-2 ${
                    tab === "profile"
                      ? "bg-white shadow text-zinc-900"
                      : "text-zinc-600"
                  }`}
                >

                  Profile
                </button>
              </div>

              {/* ===================== PROFILE TAB CONTENT ===================== */}
              {tab === "infos" && (
  <div className="mt-4 space-y-4">

    {/* stats row */}
    {/* (kept comments exactly as they were — nothing removed) */}
    {/* <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"> 
         (old coach/athlete stats UI was here)
       </section> */}

    {/* OVERVIEW CONTENT (old overview tab) */}
    {/* Entire programs / achievements / certifications UI removed as requested */}

    {/* ==================== READ-ONLY USER INFO CARD ==================== */}
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm space-y-6">

      <h2 className="text-lg font-semibold">Your Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* First Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={loggedInUser?.first_name ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={loggedInUser?.second_name ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Email
          </label>
          <input
            type="email"
            value={loggedInData?.email ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Phone
          </label>
          <input
            type="text"
            value={loggedInUser?.phone ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>


        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Location
          </label>
          <input
            type="text"
            value={loggedInUser?.location ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Date of Birth
          </label>
          <input
            type="text"
            value={loggedInUser?.date_of_birth ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            Experience Level
          </label>
          <input
            type="text"
            value={loggedInUser?.experience_level ?? ""}
            disabled
            className={readOnlyInputClass}
          />
        </div>


        {/* Message */}

       
      </div>
    </section>
  </div>
)}


              {/* ===================== INFOS TAB CONTENT (HOME) ===================== */}
              {tab === "profile" && (
                <div className="mt-4 space-y-6">
        
                 

                  {/* Notification toast */}
                  {notification && (
                    <div
                      className="
                        fixed top-4 right-4 z-50
                        flex items-center gap-3
                        bg-white dark:bg-zinc-900
                        border border-zinc-200 dark:border-zinc-700
                        rounded-xl shadow-lg p-3
                        animate-slide-in
                        min-w-[220px]
                      "
                    >
                      <div className="relative h-10 w-10 rounded-full bg-rose-500 text-white text-sm font-semibold overflow-hidden grid place-items-center">
                        {notification.user.avatar ? (
                          <img
                            src={notification.user.avatar}
                            alt={notification.user.name || "User Avatar"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{notification.user.name?.[0] || "U"}</span>
                        )}

                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                            notification.user.status === "online"
                              ? "bg-emerald-500"
                              : "bg-zinc-400"
                          }`}
                        ></span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">
                          {notification.user.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {extractTextFromHTML(notification.message.content)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stats (Home style) */}
                  {/* <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <DashboardStatCard
                      icon={<AiOutlineRise />}
                      value="0"
                      label="Workouts"
                    />
                    <DashboardStatCard
                      icon={<FiUsers />}
                      value={programs.length}
                      label={
                        role === "coach" ? "Programs" : "Subscribed Programs"
                      }
                    />
                    <DashboardStatCard
                      icon={<TbTrophy />}
                      value="0"
                      label="Achievements"
                    />
                  </section> */}

                  {/* Programs */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      {role === "coach"
                        ? "Your Programs"
                        : "Your Subscribed Programs"}
                    </h2>
                    <section className="grid grid-cols-1 gap-4">
                      {isLoadingPrograms ? (
                        <>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-2 bg-gray-200 rounded w-full" />
                                <div className="flex gap-2">
                                  <div className="h-6 bg-gray-200 rounded w-20" />
                                  <div className="h-6 bg-gray-200 rounded w-24" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : programs.length > 0 ? (
                        programs.slice(0, 5).map((el) => (
                          <Link
                            key={el.id}
                            href={`/programs/${el.id}`}
                            className="block"
                          >
                            <ProgramCard
                              title={el.title}
                              coach={el.coachName}
                              percent={Math.round(Math.random() * 100)}
                              badge={role === "coach" ? "Active" : "Subscribed"}
                              badgeTone={role === "coach" ? "green" : "red"}
                              expires={
                                role === "coach"
                                  ? "Created by you"
                                  : "Expires in 7 days"
                              }
                            />
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          <p className="text-lg">No programs found</p>
                          <p className="text-sm mt-2">
                            {role === "coach"
                              ? "Start creating your first program!"
                              : "Browse programs and subscribe to start training."}
                          </p>
                        </div>
                      )}
                    </section>
                  </div>

          

                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      Quick Actions
                    </h2>
                    <section
                      className={`grid gap-4 ${
                        role === "coach"
                          ? "grid-cols-1"
                          : "grid-cols-1 sm:grid-cols-2"
                      }`}
                    >
                      {role !== "coach" && (
                        <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
                          <Link href={"/trainers"}>
                            <div className="text-2xl mb-2" />
                            <div className="font-medium">Browse Trainers</div>
                          </Link>
                        </button>
                      )}

                      <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
                        <Link href={"/programs"}>
                          <div className="text-2xl mb-2" />
                          <div className="font-medium">View Programs</div>
                        </Link>
                      </button>
                    </section>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}