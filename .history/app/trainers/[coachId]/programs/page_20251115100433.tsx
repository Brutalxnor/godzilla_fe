// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useParams } from "next/navigation";
// import Sidebar from "@/app/components/shared/sidebar";

// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { GetProgramsByCoachId } from "@/app/programs/services/addProgram.service";
// import ProgramCard, { Program } from "@/app/programs/components/programCard";

// export default function CoachProgramsPage() {
//   const { coachId } = useParams(); // dynamic route param
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!coachId) return;

//     async function loadPrograms() {
//       try {
//         const data = await GetProgramsByCoachId(coachId as string);
//         setPrograms(
//           data.map((p) => ({
//             id: String(p.id),
//             title: p.title,
//             cover: p.cover_image_url || "/placeholder.png",
//             rating: p.rating || 4.8,
//             ratingsCount: p.subscribers || 0,
//             durationWeeks: 12,
//             level: "Intermediate",
//             price: "$49",
//             blurb: p.description || "",
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch programs:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadPrograms();
//   }, [coachId]);

//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <Suspense
//         fallback={<div className="p-6 text-gray-500">Loading sidebar...</div>}
//       >
//         <Sidebar />
//       </Suspense>

//       <main className="lg:ml-[112px] px-6 py-8 max-w-6xl cursor-pointer  mx-auto">
//         <div className="flex items-center gap-3">
//           <Link
//             href="/trainers"
//             className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700  hover:bg-white-500 hover:text-rose-500"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Trainers
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mt-4 mb-1">Programs by Coach</h1>
//         <p className="text-gray-500 text-sm mb-8">
//           Explore all available programs offered by this coach.
//         </p>

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin h-10 w-10 border-b-2 border-rose-500 rounded-full" />
//           </div>
//         ) : programs.length === 0 ? (
//           <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-600">
//             This coach hasn’t published any programs yet.
//           </div>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {programs.map((p) => (
//               <ProgramCard key={p.id} program={p} />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/shared/sidebar";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GetProgramsByCoachId } from "@/app/programs/services/addProgram.service";
import ProgramCard, { Program } from "@/app/programs/components/programCard";
import { User } from "@/app/types/type";
import { GetUserById } from "@/app/services/Auth.service";

export default function CoachProgramsPage() {
  const { coachId } = useParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Show 3 per page

  // Fetch programs
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
        console.log(data[0] , "data fetched");

      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoading(false);
      }
      
    }

    loadPrograms();
  }, [coachId]);

<<<<<<< Updated upstream
  // Pagination logic
  const totalPages = Math.ceil(programs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPrograms = programs.slice(startIndex, startIndex + itemsPerPage);
=======
  useEffect(() => {
    const fetchGetUserById = async () => {
      const data = await GetUserById(coachId as string);
      setUser(data?.data);
    };
    fetchGetUserById();
  }, [coachId]);

  // console.log(user);
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-black">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading sidebar...</div>}>
        <Sidebar />
      </Suspense>

      <main className="lg:ml-[112px] px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Back button */}
        <div className="flex items-center gap-3">
          <Link
            href="/trainers"
            className="inline-flex items-center gap-2 text-sm  hover:bg-gray-50 font-medium text-gray-700 hover:text-rose-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trainers
          </Link>
        </div>

<<<<<<< Updated upstream
        {/* Page Title */}
        <h1 className="text-3xl font-bold mt-4 mb-1">Programs by Coach</h1>
=======
        <h1 className="text-3xl font-bold mt-4 mb-1">
          Programs by {user?.first_name + " " + user?.second_name}
        </h1>
>>>>>>> Stashed changes
        <p className="text-gray-500 text-sm mb-8">
          Explore all available programs offered by this coach.
        </p>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-10 w-10 border-b-2 border-rose-500 rounded-full" />
          </div>
        ) : programs.length === 0 ? (
          /* No programs message */
          <div className="rounded-xl border border-dashed border-gray-300 bg-white dark:bg-zinc-900 py-16 text-center text-gray-600">
            This coach hasn’t published any programs yet.
          </div>
        ) : (
          <>
            {/* Full-width vertical cards */}
            <div className="flex flex-col gap-6 w-full">
              {currentPrograms.map((p) => (
                <div key={p.id} className="w-full">
                  <ProgramCard program={p} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                Previous
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={[
                      "px-4 py-2 border rounded-lg transition",
                      currentPage === pageNum
                        ? "bg-rose-500 text-white"
                        : "bg-white dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-gray-800",
                    ].join(" ")}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
