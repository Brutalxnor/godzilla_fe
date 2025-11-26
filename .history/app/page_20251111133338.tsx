// // app/dashboard/page.tsx

// "use client";

// import { FaBell } from "react-icons/fa";
// import { AiOutlineRise } from "react-icons/ai";
// import { FiUsers } from "react-icons/fi";
// import { TbTrophy } from "react-icons/tb";
// import { ReactNode, Suspense, useEffect, useState } from "react";
// import ProgramCard from "./components/shared/programCard";
// import Sidebar from "./components/shared/sidebar";
// import useGetUser from "./Hooks/useGetUser";
// import LoginForm from "./auth/Components/LoginForm";
// import axios from "axios";
// import { Program } from "./types/type";
// import { toast } from "react-toastify";
// import useGetTheme from "./Hooks/useGetTheme";
// import Link from "next/link";

// function StatCard({
//   icon,
//   value,
//   label,
// }: {
//   icon: ReactNode;
//   value: string | number;
//   label: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center">
//       <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
//         {icon}
//       </div>
//       <div className="text-xl font-semibold">{value}</div>
//       <div className="text-xs text-gray-500 mt-0.5">{label}</div>
//     </div>
//   );
// }

// export default function Home() {
//   // keep space for the hover sidebar on large screens
//   const shellVars = {
//     "--sb-w": "88px",
//     "--extra-left": "24px",
//   } as React.CSSProperties;

//   const { userDB } = useGetUser();
//   const [programs, setPrograms] = useState<{ data: Program[] }>();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchGetProgramsByUserID = async () => {
//       try {
//         setIsLoading(true);
//         const { data } = await axios.get(
//           `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe/${userDB?.data?.user_id}`
//         );

//         setPrograms(data);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           console.error("❌ Error fetching programs:", err.message);
//         } else {
//           console.error("❌ Unknown error:", err);
//         }
        
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (userDB?.data?.user_id) {
//       fetchGetProgramsByUserID();
//     }
//   }, [userDB?.data?.user_id]);

//   console.log(programs, "sdasdad");
//   const { theme } = useGetTheme();
//   return (
//     <>
//       {userDB ? (
//         <div
//           className={`min-h-screen ${
//             theme === "dark" ? "bg-black" : "bg-white"
//           }`}
//         >
//           <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
//         <Sidebar />
//       </Suspense>
//           <main
//             style={shellVars}
//             className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//           >
//             {/* Wider web layout */}
//             <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-6 md:py-10">
//               {/* Header banner */}
//               <section className="relative rounded-2xl bg-gradient-to-r from-rose-500  to-red-400 text-white px-5 py-5 mb-6 shadow-sm">
//                 <div className="text-xl md:text-2xl font-semibold">
//                   Good morning, {userDB?.data?.user.first_name}!
//                 </div>
//                 <div className="text-sm text-rose-100 mt-1">
//                   Ready to crush today&apos;s workout?
//                 </div>
//                 <button
//                   type="button"
//                   aria-label="Notifications"
//                   className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
//                 >
//                   <span className="relative">
//                     <FaBell />
//                     <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-300 ring-2 ring-rose-400" />
//                   </span>
//                 </button>
//               </section>

//               {/* Stats */}
//               <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//                 <StatCard
//                   icon={<AiOutlineRise />}
//                   value="12"
//                   label="Workouts"
//                 />
//                 <StatCard
//                   icon={<FiUsers />}
//                   value={programs?.data?.length || 2}
//                   label="Programs"
//                 />
//                 <StatCard icon={<TbTrophy />} value="5" label="Achievements" />
//               </section>

//               {/* Programs (uses shared ProgramCard) */}
//               <h2 className="text-lg font-semibold mb-3">Your Programs</h2>
//               <section className="grid grid-cols-1 gap-4 mb-6">
//                 {/* <ProgramCard
//                   title="Strength Foundation"
//                   coach="Mike Johnson"
//                   percent={75}
//                   badge="Active"
//                   badgeTone="green"
//                   expires="Expires in 14 days"
//                 />
//                 <ProgramCard
//                   title="Cardio Bootcamp"
//                   coach="Sarah Wilson"
//                   percent={45}
//                   badge="Expires Soon"
//                   badgeTone="red"
//                   expires="Expires in 7 days"
//                 /> */}

//                 {isLoading ? (
//                   // Loading Skeletons
//                   <>
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="animate-pulse">
//                         <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
//                           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                           <div className="h-2 bg-gray-200 rounded w-full"></div>
//                           <div className="flex gap-2">
//                             <div className="h-6 bg-gray-200 rounded w-20"></div>
//                             <div className="h-6 bg-gray-200 rounded w-24"></div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 ) : Array.isArray(programs?.data) &&
//                   programs?.data?.length > 0 ? (
//                   // Actual Programs
//                   programs.data.slice(0, 3).map((el) => (
//                     <div key={el.id}>
//                       <ProgramCard
//                         title={el.title}
//                         coach={el.users?.first_name}
//                         percent={Math.random() * 100}
//                         badge="Expires Soon"
//                         badgeTone="red"
//                         expires="Expires in 7 days"
//                       />
//                     </div>
//                   ))
//                 ) : (
//                   // Empty State
//                   <div className="col-span-3 text-center py-8 text-gray-500">
//                     <p className="text-lg">No programs found</p>
//                     <p className="text-sm mt-2">
//                       Start creating your first program!
//                     </p>
//                   </div>
//                 )}
//               </section>

//               {/* Recent Activity */}
//               <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
//               <section className="rounded-2xl border border-gray-200 bg-white p-4 mb-6">
//                 <ul className="space-y-3">
//                   {[
//                     "New workout added to Strength Foundation",
//                     "Sarah Wilson posted in Community",
//                     "Weekly check-in reminder",
//                   ].map((t) => (
//                     <li key={t} className="flex items-start gap-3">
//                       <span className="mt-2 h-2 w-2 rounded-full bg-rose-500" />
//                       <span className="text-sm text-gray-800">{t}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </section>

//               {/* Today’s Workout banner */}
//               <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-rose-500 to-red-400 text-white p-5 flex items-center justify-between gap-4 mb-6">
//                 <div>
//                   <div className="text-base font-semibold">
//                     Today&apos;s Workout
//                   </div>
//                   <div className="text-sm text-rose-100">
//                     Upper Body Strength
//                   </div>
//                   <div className="text-[12px] text-rose-100">
//                     45 minutes • Intermediate
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button className="rounded-xl bg-white text-rose-500 font-medium px-4 py-2 hover:bg-rose-50">
//                     ▶ Start
//                   </button>
//                   <button className="rounded-xl bg-white/20 text-white px-4 py-2 hover:bg-white/30">
//                     🗓
//                   </button>
//                 </div>
//               </section>

//               {/* Quick Actions */}
//               <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
//               <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24 lg:pb-0">
//                 <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
//                   <Link href={"/trainers"}>
//                     <div className="text-2xl mb-2"></div>
//                     <div className="font-medium">Browse Trainers</div>
//                   </Link>
//                 </button>
//                 <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
//                   <Link href={"/programs"}>
//                     <div className="text-2xl mb-2"></div>
//                     <div className="font-medium">View Programs</div>
//                   </Link>
//                 </button>
//               </section>
//             </div>
//           </main>
//              
//         </div>
//       ) : (
//         <LoginForm />
//       )}
//     </>
//   );
// }
"use client";

import { FaBell } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { TbTrophy } from "react-icons/tb";
import { ReactNode, Suspense, useEffect, useState } from "react";
import type React from "react";

import ProgramCard from "./components/shared/programCard";
import Sidebar from "./components/shared/sidebar";
import useGetUser from "./Hooks/useGetUser";
import LoginForm from "./auth/Components/LoginForm";
import axios from "axios";
import useGetTheme from "./Hooks/useGetTheme";
import Link from "next/link";

import {
  GetProgramsByCoachId,
  ProgramFromAPI,
} from "./programs/services/addProgram.service";

/* ---------- types ---------- */

function isProgramFromAPI(obj: unknown): obj is ProgramFromAPI {
  if (!obj || typeof obj !== "object") return false;
  const candidate = obj as { id?: unknown; title?: unknown };
  return (
    (typeof candidate.id === "string" || typeof candidate.id === "number") &&
    typeof candidate.title === "string"
  );
}

type DashboardProgram = {
  id: string | number;
  title: string;
  coachName: string;
};

function StatCard({
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

export default function Home() {
  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  const { userDB } = useGetUser();
  const { theme } = useGetTheme();

  const [programs, setPrograms] = useState<DashboardProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const role =
    (userDB?.data?.user?.user_type as string | undefined)?.toLowerCase() ??
    "athlete";
  const userId = userDB?.data?.user_id;

  useEffect(() => {
    if (!userId) return;

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);

        if (role === "coach") {
          // ---------- COACH: programs created by this coach ----------
          const list = await GetProgramsByCoachId(
            userId as string | number
          );

          const mapped: DashboardProgram[] = Array.isArray(list)
            ? list
                .filter(isProgramFromAPI)
                .map((p) => ({
                  id: p.id,
                  title: p.title,
                  coachName: userDB?.data?.user.first_name ?? "Coach",
                }))
            : [];

          setPrograms(mapped);
        } else {
          // ---------- ATHLETE: programs this athlete is subscribed to ----------
          // use same base URL you use in /programs page
          const response = await axios.get(
            `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe/${userId}`
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
                // prefer program id, fall back to program_id or subscription id
                id:
                  row.programs?.id ??
                  row.program_id ??
                  row.id ??
                  `${idx}`,
                // REAL program title from programs
                title: row.programs?.title ?? "Program",
                // COACH name from programs.users.first_name
                coachName: row.programs?.users?.first_name ?? "Coach",
              }))
            : [];

          setPrograms(mapped);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // if backend returns 404 when no subs, just show empty state
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
        setIsLoading(false);
      }
    };

    void fetchPrograms();
  }, [userId, role, userDB?.data?.user.first_name]);

  return (
    <>
      {userDB ? (
        <div
          className={`min-h-screen ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
            <Sidebar />
          </Suspense>

          <main
            style={shellVars}
            className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
          >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-6 md:py-10">
              {/* Header banner */}
              <section className="relative rounded-2xl bg-gradient-to-r from-rose-500  to-red-400 text-white px-5 py-5 mb-6 shadow-sm">
                <div className="text-xl md:text-2xl font-semibold">
                  Good morning, {userDB?.data?.user.first_name}!
                </div>
                <div className="text-sm text-rose-100 mt-1">
                  Ready to crush today&apos;s workout?
                </div>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                  <span className="relative">
                    <FaBell />
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-300 ring-2 ring-rose-400" />
                  </span>
                </button>
              </section>

              {/* Stats */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                  icon={<AiOutlineRise />}
                  value="0"
                  label="Workouts"
                />
                <StatCard
                  icon={<FiUsers />}
                  value={programs.length}
                  label={role === "coach" ? "Programs" : "Subscribed Programs"}
                />
                <StatCard icon={<TbTrophy />} value="0" label="Achievements" />
              </section>

              {/* Programs */}
              <h2 className="text-lg font-semibold mb-3">
                {role === "coach" ? "Your Programs" : "Your Subscribed Programs"}
              </h2>
              <section className="grid grid-cols-1 gap-4 mb-6">
                {isLoading ? (
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
                  programs.slice(0, 3).map((el) => (
                    <div key={el.id}>
                      <ProgramCard
                        title={el.title}            // ✅ program name
                        coach={el.coachName}        // ✅ coach name
                        percent={Math.round(Math.random() * 100)}
                        badge={role === "coach" ? "Active" : "Subscribed"}
                        badgeTone={role === "coach" ? "green" : "red"}
                        expires={
                          role === "coach"
                            ? "Created by you"
                            : "Expires in 7 days"
                        }
                      />
                    </div>
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

              {/* Recent Activity */}
              <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
              <section className="rounded-2xl border border-gray-200 bg-white p-4 mb-6">
                <ul className="space-y-3">
                  {[
                    "New workout added to Strength Foundation",
                    "Sarah Wilson posted in Community",
                    "Weekly check-in reminder",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-sm text-gray-800">{t}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Today’s Workout banner */}
              <section className="rounded-2xl border border-gray-200 bg-gradient-to-r from-rose-500 to-red-400 text-white p-5 flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-base font-semibold">
                    Today&apos;s Workout
                  </div>
                  <div className="text-sm text-rose-100">
                    Upper Body Strength
                  </div>
                  <div className="text-[12px] text-rose-100">
                    45 minutes • Intermediate
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-xl bg-white text-rose-500 font-medium px-4 py-2 hover:bg-rose-50">
                    ▶ Start
                  </button>
                  <button className="rounded-xl bg-white/20 text-white px-4 py-2 hover:bg-white/30">
                    🗓
                  </button>
                </div>
              </section>

              {/* Quick Actions */}
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24 lg:pb-0">
                <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
                  <Link href={"/trainers"}>
                    <div className="text-2xl mb-2" />
                    <div className="font-medium">Browse Trainers</div>
                  </Link>
                </button>
                <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
                  <Link href={"/programs"}>
                    <div className="text-2xl mb-2" />
                    <div className="font-medium">View Programs</div>
                  </Link>
                </button>
              </section>
            </div>
          </main>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
