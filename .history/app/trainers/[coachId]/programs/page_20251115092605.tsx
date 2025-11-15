"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/shared/sidebar";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GetProgramsByCoachId } from "@/app/programs/services/addProgram.service";
import ProgramCard, { Program } from "@/app/programs/components/programCard";

export default function CoachProgramsPage() {
  const { coachId } = useParams(); // dynamic route param
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);



  console.log(co);
  

  useEffect(() => {
    if (!coachId) return;

    async function loadPrograms() {
      try {
        const data = await GetProgramsByCoachId(coachId as string);
        setPrograms(
          data.map((p) => ({
            id: String(p.id),
            title: p.title,
            cover: p.cover_image_url || "/placeholder.png",
            rating: p.rating || 4.8,
            ratingsCount: p.subscribers || 0,
            durationWeeks: 12,
            level: "Intermediate",
            price: "$49",
            blurb: p.description || "",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, [coachId]);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Suspense
        fallback={<div className="p-6 text-gray-500">Loading sidebar...</div>}
      >
        <Sidebar />
      </Suspense>

      <main className="lg:ml-[112px] px-6 py-8 max-w-6xl cursor-pointer  mx-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/trainers"
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 hover:text-rose-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trainers
          </Link>
        </div>

        <h1 className="text-3xl font-bold mt-4 mb-1">Programs by Coach</h1>
        <p className="text-gray-500 text-sm mb-8">
          Explore all available programs offered by this coach.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-10 w-10 border-b-2 border-rose-500 rounded-full" />
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-600">
            This coach hasn’t published any programs yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
