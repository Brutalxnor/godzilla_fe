// app/dashboard/page.tsx

import { FaBell } from "react-icons/fa";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { TbTrophy } from "react-icons/tb";
import { ReactNode } from "react";
import ProgramCard from "../components/shared/programCard";
import Sidebar from "../components/shared/sidebar";

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
  // keep space for the hover sidebar on large screens
  const shellVars = { "--sb-w": "88px", "--extra-left": "24px" } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar />

      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
      >
        {/* Wider web layout */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 py-6 md:py-10">

          {/* Header banner */}
          <section className="relative rounded-2xl bg-gradient-to-r from-rose-500  to-red-400 text-white px-5 py-5 mb-6 shadow-sm">
            <div className="text-xl md:text-2xl font-semibold">Good morning, Youssef!</div>
            <div className="text-sm text-rose-100 mt-1">Ready to crush today&apos;s workout?</div>
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
            <StatCard icon={<AiOutlineRise />} value="12" label="Workouts" />
            <StatCard icon={<FiUsers />} value="3" label="Programs" />
            <StatCard icon={<TbTrophy />} value="5" label="Achievements" />
          </section>

          {/* Programs (uses shared ProgramCard) */}
          <h2 className="text-lg font-semibold mb-3">Your Programs</h2>
          <section className="grid grid-cols-1 gap-4 mb-6">
            <ProgramCard
              title="Strength Foundation"
              coach="Mike Johnson"
              percent={75}
              badge="Active"
              badgeTone="green"
              expires="Expires in 14 days"
            />
            <ProgramCard
              title="Cardio Bootcamp"
              coach="Sarah Wilson"
              percent={45}
              badge="Expires Soon"
              badgeTone="red"
              expires="Expires in 7 days"
            />
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
              <div className="text-base font-semibold">Today&apos;s Workout</div>
              <div className="text-sm text-rose-100">Upper Body Strength</div>
              <div className="text-[12px] text-rose-100">45 minutes • Intermediate</div>
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
              <div className="text-2xl mb-2">🧑‍🏫</div>
              <div className="font-medium">Browse Trainers</div>
            </button>
            <button className="rounded-2xl border border-gray-200 bg-white p-5 text-center hover:bg-gray-50">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium">View Progress</div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
