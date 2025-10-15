"use client";
import Sidebar from "@/app/components/shared/sidebar";
import axios from "axios";
import {
  Award,
  Calendar,
  MoveLeft,
  Star,
  Users,
  Play,
  Heart,
} from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Program } from "../components/programCard";
import useGetUser from "@/app/Hooks/useGetUser";
import Link from "next/link";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );
  const { userDB } = useGetUser();
  const [programs, setPrograms] = useState<{ data: Program }>();

  const tabs = ["Overview", "Materials", "Reviews", "FAQ"];
  

  useEffect(() => {
    const fetchGetProgramsByUserID = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://godzilla-be.vercel.app/api/v1/programs/${id}`
        );
        setPrograms(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ Error fetching programs:", err.message);
        } else {
          console.error("❌ Unknown error:", err);
        }
        toast.error("Failed to fetch programs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userDB?.data?.user_id) {
      fetchGetProgramsByUserID();
    }
  }, [id, userDB?.data?.user_id]);

  console.log(programs);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Sidebar />
        <main
          style={shellVars}
          className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
      >
        {/* Header with back button */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          <div className="px-6 py-4 flex items-center gap-2">
            <Link href={"/programs"}>
              <MoveLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            </Link>
            <h1 className="text-lg font-medium">Program Details</h1>
          </div>

          {/* Hero Image Section */}
          <div className="relative">
            <img
              src={
                programs?.data?.cover_image_url || "/api/placeholder/1200/400"
              }
              alt="Program Hero"
              className="w-full h-80 object-cover"
            />

            <div className="absolute top-0 w-full h-full bg-black/30"></div>
            {/* Premium badge */}
            <div className="absolute top-4 left-6">
              <span className="bg-rose-500 text-white px-3 py-1 rounded text-sm font-medium">
                premium
              </span>
            </div>
            {/* Pricing in top right */}
            <div className="absolute top-4 right-6 text-white text-right">
              <div className="text-sm line-through opacity-75">$69/month</div>
              <div className="text-lg font-bold">$49/month</div>
            </div>
            {/* Preview button */}
            <div className="absolute bottom-4 right-6">
              <button className="bg-white text-gray-800 px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-gray-100 transition-colors">
                <Play className="w-4 h-4" />
                Preview (5:30)
              </button>
            </div>
          </div>

          {/* Program Title and Stats */}
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold mb-4">
              {programs?.data?.title || "Strength Foundation"}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9</span>
                <span>(156 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>234 subscribers</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>12 weeks</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Beginner</span>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              {programs?.data?.description ||
                "Build a solid foundation of strength with this comprehensive beginner program. Perfect for those starting their strength training journey or looking to perfect their form and technique."}
            </p>

            {/* Coach Profile Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {programs?.data?.users?.first_name.slice(0, 1)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {programs?.data?.users?.first_name}
                    </h3>
                    <span className="text-[var(--accent)] text-xs bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-1 rounded">
                        Verified Coach
                    </span>

                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.9 rating</span>
                  </div>
                </div>
              </div>
              <Link
    href={
      programs?.data?.users?.id
        ? `/profile?user_id=${programs.data.users.id}`
        : "#"
    }
    className="text-gray-600 cursor-pointer hover:text-gray-800 font-medium"
    aria-disabled={!programs?.data?.users?.id}
  >
    View Profile
  </Link>
              
            </div>

            {/* Subscribe Button */}
            <button className="w-full bg-rose-500 cursor-pointer text-white py-3 rounded font-medium hover:bg-rose-700 transition-colors mb-8">
              Subscribe Now
            </button>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8 w-full justify-around">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "border-red-600 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "Overview" && (
              <div className="space-y-8 ">
                {/* About This Program Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    About This Program
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      This 12-week strength foundation program is designed to
                      help beginners build a solid base of strength while
                      learning proper form and technique. You will progress
                      through carefully structured workouts that target all
                      major muscle groups, with detailed video demonstrations
                      and form cues for every exercise.
                    </p>
                    <p>
                      The program includes progressive overload principles,
                      ensuring you continue to get stronger week after week. You
                      will also receive nutrition guidance to support your
                      strength gains and recovery.
                    </p>
                  </div>
                </div>

                {/* What's Included Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    What is Included
                  </h2>
                  <div className="space-y-3">
                    {[
                      "12 week progressive program",
                      "HD video tutorials",
                      "Downloadable PDF guides",
                      "Progress tracking tools",
                      "Nutrition guidelines",
                      "24/7 support access",
                      "Mobile app access",
                      "Community forum access",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Materials" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Program Materials</h2>
                <p className="text-gray-700">
                  Materials content will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <p className="text-gray-700">
                  Reviews content will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "FAQ" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-700">
                  FAQ content will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
