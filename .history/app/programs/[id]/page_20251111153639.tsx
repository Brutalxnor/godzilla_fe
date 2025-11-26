// "use client";
// import Sidebar from "@/app/components/shared/sidebar";
// import axios from "axios";
// import {
//   Award,
//   Calendar,
//   MoveLeft,
//   Star,
//   Users,
//   Play,
//   Heart,
// } from "lucide-react";
// import { use, useEffect, useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import { Program } from "../components/programCard";
// import useGetUser from "@/app/Hooks/useGetUser";
// import Link from "next/link";

// const Page = ({ params }: { params: Promise<{ id: string }> }) => {
//   const { id } = use(params);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("Overview");
//   const [programMedia, setProgramMedia] = useState<
//     {
//       id: string;
//       title: string;
//       description: string;
//       url: string;
//       media_type: string;
//       mime_type: string;
//     }[]
//   >([]);

//   useEffect(() => {
//     const fetchProgramMedia = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/f2f50790-dbdb-4a2b-8402-7fa07c527b07/media`,
//           {
//             headers: {
//               Authorization: `Bearer ${userDB?.data.access_token}`,
//             },
//           }
//         );

//         // لو الـ backend بيرجع بالشكل:
//         // { status: "success", data: [...] }
//         setProgramMedia(data?.data || []);

//         console.log("🎬 Program media:", data?.data);
//       } catch (err: unknown) {
//         console.error("❌ Error fetching program media:", err);
//         toast.error("Failed to load program media");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProgramMedia();
//     }
//   }, [id]);

//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );
//   const { userDB } = useGetUser();
//   const [programs, setPrograms] = useState<{ data: Program }>();
//   const [subscribedProgramIds, setSubscribedProgramIds] = useState<string[]>(
//     []
//   );
//   const [selectedMedia, setSelectedMedia] = useState<{
//     title: string;
//     media_type: string;
//     url: string;
//   } | null>(null);

//   useEffect(() => {
//     const fetchProgramAndSubscriptions = async () => {
//       try {
//         setLoading(true);

//         // 1️⃣ هات بيانات البرنامج الحالي
//         const { data: programRes } = await axios.get(
//           `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/${id}`
//         );
//         setPrograms(programRes);

//         // 2️⃣ هات اشتراكات المستخدم
//         const { data: subsRes } = await axios.get(
//           `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe/${userDB?.data?.user_id}`
//         );

//         // لو الـ backend بيرجع array فيه program_id
//         const ids =
//           subsRes?.data?.map((sub: { program_id: string }) => sub.program_id) ||
//           [];
//         setSubscribedProgramIds(ids);
//       } catch (err: unknown) {
//         console.error("❌ Error fetching data:", err);
//         //toast.error("Failed to fetch data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userDB?.data?.user_id && id) {
//       fetchProgramAndSubscriptions();
//     }
//   }, [id, userDB?.data?.user_id]);

//   const tabs = ["Overview", "Materials", "Reviews", "FAQ"];
  

//   useEffect(() => {
//     const fetchGetProgramsByUserID = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/${id}`
//         );
//         setPrograms(data);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           console.error("❌ Error fetching programs:", err.message);
//         } else {
//           console.error("❌ Unknown error:", err);
//         }
//         toast.error("Failed to fetch programs. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userDB?.data?.user_id) {
//       fetchGetProgramsByUserID();
//     }
//   }, [id, userDB?.data?.user_id]);

//   const isSubscribed = subscribedProgramIds.includes(id as string);

//   console.log(programs);
  

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f7f7f7]">
//         <Sidebar />
//         <main
//           style={shellVars}
//           className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
//         >
//           <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//             <div className="animate-pulse">
//               <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
//               <div className="h-64 bg-gray-300 rounded mb-6"></div>
//               <div className="h-32 bg-gray-300 rounded"></div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Sidebar />

//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
//       >
//         {/* Header with back button */}
//         <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//           <div className="px-6 py-4 flex items-center gap-2">
//             <Link href={"/programs"}>
//               <MoveLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
//             </Link>
//             <h1 className="text-lg font-medium">Program Details</h1>
//           </div>

//           {/* Hero Image Section */}
//           <div className="relative">
//             <img
//               src={
//                 programs?.data?.cover_image_url || "/api/placeholder/1200/400"
//               }
//               alt="Program Hero"
//               className="w-full h-80 object-cover"
//             />

//             <div className="absolute top-0 w-full h-full bg-black/30"></div>
//             {/* Premium badge */}
//             <div className="absolute top-4 left-6">
//               <span className="bg-rose-500 text-white px-3 py-1 rounded text-sm font-medium">
//                 premium
//               </span>
//             </div>
//             {/* Pricing in top right */}
//             <div className="absolute top-4 right-6 text-white text-right">
//               <div className="text-sm line-through opacity-75">$69/month</div>
//               <div className="text-lg font-bold">$49/month</div>
//             </div>
//             {/* Preview button */}
//             <div className="absolute bottom-4 right-6">
//               <button className="bg-white text-gray-800 px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-gray-100 transition-colors">
//                 <Play className="w-4 h-4" />
//                 Preview (5:30)
//               </button>
//             </div>
//           </div>

//           {/* Program Title and Stats */}
//           <div className="px-6 py-6">
//             <h1 className="text-3xl font-bold mb-4">
//               {programs?.data?.title || "Strength Foundation"}
//             </h1>

//             <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
//               <div className="flex items-center gap-1">
//                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                 <span className="font-medium">4.9</span>
//                 <span>(156 reviews)</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Users className="w-4 h-4" />
//                 <span>234 subscribers</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 <span>12 weeks</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Award className="w-4 h-4" />
//                 <span>Beginner</span>
//               </div>
//             </div>

//             <p className="text-gray-600 mb-8">
//               {programs?.data?.description ||
//                 "Build a solid foundation of strength with this comprehensive beginner program. Perfect for those starting their strength training journey or looking to perfect their form and technique."}
//             </p>

//             {/* Coach Profile Section */}
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
//                   <span className="text-white font-medium">
//                     {programs?.data?.users?.first_name.slice(0, 1)}
//                   </span>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-semibold">
//                       {programs?.data?.users?.first_name}
//                     </h3>
//                     <span className="text-[var(--accent)] text-xs bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-1 rounded">
//                         Verified Coach
//                     </span>

//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                     <span className="text-sm text-gray-600">4.9 rating</span>
//                   </div>
//                 </div>
//               </div>
//               <Link
//     href={
//       programs?.data?.users?.id
//         ? `/profile?user_id=${programs.data.users.id}`
//         : "#"
//     }
//     className="text-gray-600 cursor-pointer hover:text-gray-800 font-medium"
//     aria-disabled={!programs?.data?.users?.id}
//   >
//     View Profile
//   </Link>
              
//             </div>

//             {/* Subscribe Button */}

//             <button
//               disabled={isSubscribed}
//               onClick={() => {
//                 if (!isSubscribed) {
//                   // هنا تقدر تضيف كود الاشتراك الفعلي لو لسه مشتركش
//                   console.log("Subscribing to program:", programs?.data?.id);
//                 }
//               }}
//               className={`w-full py-3 rounded font-medium transition-colors mb-8 ${
//                 isSubscribed
//                   ? "bg-gray-300 text-gray-700 cursor-not-allowed"
//                   : "bg-rose-500 text-white hover:bg-rose-700"
//               }`}
//             >
//               {isSubscribed ? "Subscribed" : "Subscribe Now"}

//             </button>

//             {/* Navigation Tabs */}
//             <div className="border-b border-gray-200 mb-8">
//               <div className="flex space-x-8 w-full justify-around">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
//                       activeTab === tab
//                         ? "border-red-600 text-red-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             {activeTab === "Overview" && (
//               <div className="space-y-8 ">
//                 {/* About This Program Section */}
//                 <div>
//                   <h2 className="text-lg font-semibold mb-4">
//                     About This Program
//                   </h2>
//                   <div className="space-y-4 text-gray-700">
//                     <p>{programs?.data?.description}</p>
//                   </div>
//                 </div>

//                 {/* What's Included Section */}
//                 <div>
//                   <h2 className="text-lg font-semibold mb-4">
//                     What is Included
//                   </h2>
//                   <div className="space-y-3">
//                     {[
//                       "12 week progressive program",
//                       "HD video tutorials",
//                       "Downloadable PDF guides",
//                       "Progress tracking tools",
//                       "Nutrition guidelines",
//                       "24/7 support access",
//                       "Mobile app access",
//                       "Community forum access",
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
//                         <span className="text-gray-700">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "Materials" && (
//               <div className="space-y-6">
//                 <h2 className="text-lg font-semibold mb-4">
//                   Program Materials
//                 </h2>

//                 <div className="mt-6">
//                   {programMedia?.length > 0 ? (
//                     <div className="gap-6 flex flex-col">
//                       {programMedia.map((item) => (
//                         <div
//                           key={item.id}
//                           onClick={() => setSelectedMedia(item)}
//                           className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition bg-white"
//                         >
//                           <div className="flex justify-between mx-3">
//                             <div className="flex items-center gap-3">
//                               <Play size={20} />
//                               <h3 className="font-semibold text-gray-800 mb-2">
//                                 {item.title}
//                               </h3>
//                             </div>

//                             <div>
//                               <h1 className="bg-[#dddddd] px-4 py-1 rounded-xl font-bold">
//                                 {item.mime_type === "video/quicktime"
//                                   ? "Video"
//                                   : "Image"}
//                               </h1>
//                             </div>
//                           </div>

//                           <p className="text-sm text-gray-600 mb-3">
//                             {item.description}
//                           </p>

//                           <div className="relative">
//                             {/* <video
//                                 src={item.url}
//                                 className="w-full rounded-lg opacity-70"
//                                 muted
//                               />
//                               <div className="absolute inset-0 flex items-center justify-center">
//                                 <div className="bg-white/80 rounded-full p-3 shadow">
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="currentColor"
//                                     viewBox="0 0 16 16"
//                                     className="w-6 h-6 text-black"
//                                   >
//                                     <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
//                                   </svg>
//                                 </div>
//                               </div> */}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No materials available yet.</p>
//                   )}

//                   {/* ✅ Custom Modal */}
//                   {selectedMedia && (
//                     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
//                       <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 relative">
//                         {/* Close Button */}
//                         <button
//                           onClick={() => setSelectedMedia(null)}
//                           className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl"
//                         >
//                           &times;
//                         </button>

//                         {/* Title */}
//                         <div className="p-4 border-b">
//                           <h2 className="text-lg font-semibold text-gray-800">
//                             {selectedMedia.title}
//                           </h2>
//                         </div>

//                         {/* Media */}
//                         <div className="p-4 flex justify-center">
//                           {selectedMedia.media_type?.includes("video") ? (
//                             <video
//                               src={selectedMedia.url}
//                               controls
//                               autoPlay
//                               className="w-full rounded-lg"
//                             />
//                           ) : (
//                             <img
//                               src={selectedMedia.url}
//                               alt={selectedMedia.title}
//                               className="w-full rounded-lg"
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {activeTab === "Reviews" && (
//               <div className="space-y-6">
//                 <h2 className="text-lg font-semibold">Reviews</h2>
//                 <p className="text-gray-700">
//                   Reviews content will be displayed here.
//                 </p>
//               </div>
//             )}

//             {activeTab === "FAQ" && (
//               <div className="space-y-6">
//                 <h2 className="text-lg font-semibold">
//                   Frequently Asked Questions
//                 </h2>
//                 <p className="text-gray-700">
//                   FAQ content will be displayed here.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Page;


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
} from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Program } from "../components/programCard";
import useGetUser from "@/app/Hooks/useGetUser";
import Link from "next/link";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"Overview" | "Materials" | "Reviews" | "FAQ">("Overview");
  const [programMedia, setProgramMedia] = useState<
    {
      id: string;
      title: string;
      description: string;
      url: string;
      media_type: string;
      mime_type: string;
    }[]
  >([]);
  const [programs, setPrograms] = useState<{ data: Program }>();
  const [subscribedProgramIds, setSubscribedProgramIds] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{
    title: string;
    media_type: string;
    url: string;
  } | null>(null);

  const { userDB } = useGetUser();

  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const tabs: Array<"Overview" | "Materials" | "Reviews" | "FAQ"> = [
    "Overview",
    "Materials",
    "Reviews",
    "FAQ",
  ];

  // Fetch program media
  useEffect(() => {
    const fetchProgramMedia = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/${id}/media`,
          {
            headers: {
              Authorization: `Bearer ${userDB?.data.access_token}`,
            },
          }
        );
        setProgramMedia(data?.data || []);
      } catch (err: unknown) {
        console.error("❌ Error fetching program media:", err);
        toast.error("Failed to load program media");
      } finally {
        setLoading(false);
      }
    };

    if (id && userDB?.data?.access_token) {
      void fetchProgramMedia();
    }
  }, [id, userDB?.data?.access_token]);

  // Fetch program & subscriptions
  useEffect(() => {
    const fetchProgramAndSubscriptions = async () => {
      try {
        setLoading(true);

        const { data: programRes } = await axios.get(
          `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/${id}`
        );
        setPrograms(programRes);

        const { data: subsRes } = await axios.get(
          `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe/${userDB?.data?.user_id}`
        );

        const ids =
          subsRes?.data?.map((sub: { program_id: string }) => sub.program_id) ||
          [];
        setSubscribedProgramIds(ids);
      } catch (err: unknown) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userDB?.data?.user_id && id) {
      void fetchProgramAndSubscriptions();
    }
  }, [id, userDB?.data?.user_id]);

  const isSubscribed = subscribedProgramIds.includes(id as string);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <Sidebar />
        <main
          style={shellVars}
          className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] lg:pl-[var(--extra-left)]"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/3" />
              <div className="h-64 bg-gray-300 rounded" />
              <div className="h-32 bg-gray-300 rounded" />
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
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] lg:pl-[var(--extra-left)]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-4 md:py-8">
          {/* Header with back button */}
          <div className="px-0 sm:px-6 py-3 flex items-center gap-2">
            <Link href={"/programs"}>
              <MoveLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            </Link>
            <h1 className="text-base sm:text-lg font-medium">
              Program Details
            </h1>
          </div>

          {/* Hero Image Section */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={
                programs?.data?.cover_image_url || "/api/placeholder/1200/400"
              }
              alt="Program Hero"
              className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />

            {/* Premium badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-6">
              <span className="bg-rose-500 text-white px-3 py-1 rounded text-xs sm:text-sm font-medium">
                Premium
              </span>
            </div>

            {/* Pricing in top right */}
            {/* <div className="absolute top-3 right-3 sm:top-4 sm:right-6 text-white text-right text-xs sm:text-sm">
              <div className="line-through opacity-75">$69/month</div>
              <div className="text-base sm:text-lg font-bold">$49/month</div>
            </div> */}

            {/* Preview button */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6">
              <button className="bg-white text-gray-800 px-3 sm:px-4 py-2 rounded flex items-center gap-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors">
                <Play className="w-4 h-4" />
                Preview (5:30)
              </button>
            </div>
          </div>

          {/* Program Title and Stats */}
          <div className="px-0 sm:px-6 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              {programs?.data?.title || "Strength Foundation"}
            </h1>

            {/* 👉 wraps nicely on small screens */}
            {/* <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-gray-600 mb-6">
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
            </div> */}

            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              {programs?.data?.description ||
                "Build a solid foundation of strength with this comprehensive beginner program. Perfect for those starting their strength training journey or looking to perfect their form and technique."}
            </p>

            {/* Coach Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {programs?.data?.users?.first_name
                      ? programs.data.users.first_name.slice(0, 1)
                      : "C"}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {programs?.data?.users?.first_name ?? "Coach"}
                    </h3>
                    <span className="text-[10px] sm:text-xs text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-1 rounded">
                      Verified Coach
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      4.9 rating
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={
                  programs?.data?.users?.id
                    ? `/profile?user_id=${programs.data.users.id}`
                    : "#"
                }
                className="text-sm text-gray-600 hover:text-gray-800 font-medium self-start sm:self-auto"
                aria-disabled={!programs?.data?.users?.id}
              >
                View Profile
              </Link>
            </div>

            {/* Subscribe Button */}
            <button
              disabled={isSubscribed}
              onClick={() => {
                if (!isSubscribed) {
                  console.log("Subscribing to program:", programs?.data?.id);
                }
              }}
              className={`w-full py-3 rounded font-medium transition-colors mb-8 text-sm sm:text-base ${
                isSubscribed
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-rose-500 text-white hover:bg-rose-700"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe Now"}
            </button>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6 sm:mb-8">
              <div className="flex w-full justify-between sm:justify-around overflow-x-auto text-xs sm:text-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-2 border-b-2 font-medium whitespace-nowrap ${
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
              <div className="space-y-8">
                {/* About This Program */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    About This Program
                  </h2>
                  <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                    <p>{programs?.data?.description}</p>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    What is Included
                  </h2>
                  <div className="space-y-2 text-sm sm:text-base">
                    {[
                      "12 week progressive program",
                      "HD video tutorials",
                      "Downloadable PDF guides",
                      "Progress tracking tools",
                      "Nutrition guidelines",
                      "24/7 support access",
                      "Mobile app access",
                      "Community forum access",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Materials" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-2 sm:mb-4">
                  Program Materials
                </h2>

                <div className="mt-2 sm:mt-6">
                  {programMedia?.length > 0 ? (
                    <div className="flex flex-col gap-4 sm:gap-6">
                      {programMedia.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMedia(item)}
                          className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition bg-white"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mx-1 sm:mx-3">
                            <div className="flex items-center gap-3">
                              <Play size={20} />
                              <h3 className="font-semibold text-gray-800">
                                {item.title}
                              </h3>
                            </div>

                            <div>
                              <span className="inline-block bg-[#dddddd] px-3 py-1 rounded-xl text-xs font-semibold">
                                {item.mime_type === "video/quicktime"
                                  ? "Video"
                                  : "Image"}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mt-2">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No materials available yet.
                    </p>
                  )}

                  {/* Media Modal */}
                  {selectedMedia && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 relative">
                        <button
                          onClick={() => setSelectedMedia(null)}
                          className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl"
                        >
                          &times;
                        </button>

                        <div className="p-4 border-b">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {selectedMedia.title}
                          </h2>
                        </div>

                        <div className="p-4 flex justify-center">
                          {selectedMedia.media_type?.includes("video") ? (
                            <video
                              src={selectedMedia.url}
                              controls
                              autoPlay
                              className="w-full rounded-lg"
                            />
                          ) : (
                            <img
                              src={selectedMedia.url}
                              alt={selectedMedia.title}
                              className="w-full rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <p className="text-gray-700 text-sm sm:text-base">
                  Reviews content will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "FAQ" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg font-semibold">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-700 text-sm sm:text-base">
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
