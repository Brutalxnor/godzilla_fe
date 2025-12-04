// "use client";

// import { Suspense, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Sidebar from "../components/shared/sidebar";
// import { Filter, Search } from "lucide-react";
// import TrainerCard, { Trainer } from "./TrainerCard";

// /* ============================
//    Config + fetching
// ============================= */
// const API_BASE =
//   (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") as string | undefined) ??
//   "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1";

// const CATEGORIES = ["All", "Strength", "Cardio", "Yoga", "Nutrition", "HIIT"];

// async function fetchTrainers(query: string, category: string): Promise<Trainer[]> {
//   try {
//     // Hook to your backend if available:
//     // const res = await axios.get(`${API_BASE}/coaches`, { params: { q: query, category }});
//     // return (res.data?.data as any[]).map(mapper);

//     // Mock data (remove when backend is wired)
//     const mock: Trainer[] = [
//       {
//         id: 1,
//         first_name: "Ahmed",
//         second_name: "Mahmoud",
//         user_type: "coach",
//         location: "Cairo, Egypt",
//         rating: 4.9,
//         reviews_count: 156,
//         monthly_price: 49,
//         verified: true,
//         tags: ["Strength Training", "Powerlifting", "Nutrition"],
//         bio: "Certified strength coach with 8+ years of experience. Specialized in powerlifting and strength development for all levels.",
//         programs_count: 5,
//         cover_url:
//           "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
//         avatar_url:
//           "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
//       },
//       // add more items if you like…
//     ];

//     const q = query.toLowerCase().trim();
//     const cat = category.toLowerCase();
//     return mock.filter((t) => {
//       const hitQ =
//         !q ||
//         t.first_name.toLowerCase().includes(q) ||
//         t.second_name.toLowerCase().includes(q) ||
//         t.location.toLowerCase().includes(q) ||
//         t.tags.some((tg) => tg.toLowerCase().includes(q)) ||
//         t.bio.toLowerCase().includes(q);
//       const hitCat = !cat || cat === "all" || t.tags.some((tg) => tg.toLowerCase().includes(cat));
//       return hitQ && hitCat;
//     });
//   } catch {
//     return [];
//   }
// }

// /* ============================
//    Small UI bits
// ============================= */
// function CategoryTabs({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {CATEGORIES.map((c) => {
//         const active = value === c;
//         return (
//           <button
//             key={c}
//             onClick={() => onChange(c)}
//             className={[
//               "rounded-full px-3 py-1 text-xs font-medium",
//               active
//                 ? "bg-rose-100 text-rose-700"
//                 : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
//             ].join(" ")}
//           >
//             {c}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function SearchBar({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="relative w-full max-w-xl">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder="Search trainers or specialties..."
//         className="w-full rounded-full bg-white pl-9 pr-10 py-2 text-sm border border-gray-200 outline-none hover:bg-gray-50"
//       />
//       <button
//         className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
//         title="Filters"
//       >
//         <Filter className="h-3.5 w-3.5" /> Filter
//       </button>
//     </div>
//   );
// }

// /* ============================
//    Page
// ============================= */
// export default function TrainersPage() {
//   const shellVars = useMemo(
//     () =>
//       ({
//         "--sb-w": "88px",
//         "--extra-left": "24px",
//       } as React.CSSProperties),
//     []
//   );

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState<string>("All");
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState<Trainer[]>([]);

//   useEffect(() => {
//     let cancelled = false;
//     async function load() {
//       setLoading(true);
//       try {
//         const list = await fetchTrainers(search, category);
//         if (!cancelled) setItems(list);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       cancelled = true;
//     };
//   }, [search, category]);

//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
//         <Sidebar />
//       </Suspense>

//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//       >
//         <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//           {/* Title */}
//           <div className="flex items-center justify-between">
//             <h1 className="text-4xl font-bold">Find Your Trainer</h1>
//           </div>
//           <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

//           {/* Search */}
//           <div className="mt-8">
//             <SearchBar value={search} onChange={setSearch} />
//           </div>

//           {/* Category chips */}
//           <div className="mt-4">
//             <CategoryTabs value={category} onChange={setCategory} />
//           </div>

//           {/* count */}
//           <div className="mt-4 text-sm text-gray-600">
//             {loading ? "Loading…" : `${items.length} trainer${items.length === 1 ? "" : "s"} found`}
//           </div>

//           {/* list */}
//           <section className="mt-4 space-y-5">
//             {loading ? (
//               <div className="flex justify-center items-center py-10">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
//               </div>
//             ) : items.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-sm text-gray-600">
//                 No trainers match your search.
//               </div>
//             ) : (
//               items.map((t) => (
//                 <TrainerCard
//                   key={String(t.id)}
//                   trainer={t}
//                   onPreview={(coach) => {
//                     // TODO: open preview modal
//                     console.log("preview", coach.id);
//                   }}
//                   onViewProfile={(coach) => {
//                     // TODO: router.push(`/trainers/${coach.id}`)
//                     console.log("view profile", coach.id);
//                   }}
//                 />
//               ))
//             )}
//           </section>

//           <div className="pb-24 lg:pb-0" />
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import Sidebar from "../components/shared/sidebar";
import { Filter, Search } from "lucide-react";
import TrainerCard, { Trainer } from "./TrainerCard";
import { getAllCoaches } from "../services/trainers.service";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import useGetUser from "../Hooks/useGetUser";
import { GetUserById } from "../services/Auth.service";

// ===== Types from Home component =====
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

// ===== fetch + filter logic =====
async function fetchTrainers(
  query: string,
  category: string,
  id: string
): Promise<Trainer[]> {
  try {
    const all = await getAllCoaches(id);

    const q = query.toLowerCase().trim();
    const cat = category.toLowerCase();

    return all.filter((t) => {
      const hitQ =
        !q ||
        t.first_name.toLowerCase().includes(q) ||
        t.second_name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        t.bio.toLowerCase().includes(q);

      const hitCat =
        !cat ||
        cat === "all" ||
        t.tags.some((tg) => tg.toLowerCase().includes(cat));

      return hitQ && hitCat;
    });
  } catch (err) {
    console.error("Error fetching trainers:", err);
    return [];
  }
}

// ===== search bar =====
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search trainers or specialties..."
        className="w-full rounded-full bg-white pl-9 pr-10 py-2 text-sm border border-gray-200 outline-none hover:bg-gray-50"
      />
      <button
        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
        title="Filters"
      >
        <Filter className="h-3.5 w-3.5" /> Filter
      </button>
    </div>
  );
}

// ===== PAGE =====
export default function TrainersPage() {
  const shellVars = useMemo(
    () =>
      ({
        "--sb-w": "88px",
        "--extra-left": "24px",
      } as React.CSSProperties),
    []
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Trainer[]>([]);

  // Notification-related states
  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeUsers, setActiveUsers] = useState<LiteUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    user: LiteUser;
    message: ChatMessage;
  } | null>(null);
  const [sender_id, setSenderId] = useState<string>();
  const [conversations, setConversations] = useState<string[]>([]);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const { userDB } = useGetUser();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 4;

  // Fetch users (same as Home)
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const res = await fetch(
        "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers"
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
          (user: { id: string; first_name: string; status: string }) =>
            user.id !== userDB?.data?.user_id
        )
        .sort((a: { status: string }, b: { status: string }) => {
          if (a.status === "online") return -1;
          if (a.status !== "online") return 1;
          return 0;
        });

      setActiveUsers(formattedUsers);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userDB?.data?.user_id) fetchUsers();
  }, [userDB?.data?.user_id]);

  // Fetch user by sender_id (same as Home)
  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(sender_id as string);
    };

    if (sender_id) fetchUser();
  }, [sender_id]);

  // Fetch conversations (same as Home)
  useEffect(() => {
    if (!userDB?.data?.user_id) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/chat/conversations",
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
        // toast.error("Failed to load conversations");
      }
    };

    fetchConversations();
  }, [userDB?.data?.user_id, userDB?.data.access_token]);

  // Set up Supabase real-time channels (same as Home)
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

  // Fetch trainers (original logic)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const list = await fetchTrainers(search, category);
        if (!cancelled) {
          setItems(list);
          setCurrentPage(1); // reset page on filter/search change
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [search, category]);

  // Pagination math
  const totalPages = Math.ceil(items.length / trainersPerPage);
  const startIndex = (currentPage - 1) * trainersPerPage;
  const currentItems = items.slice(startIndex, startIndex + trainersPerPage);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>

      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          {/* Notification UI (same as Home) */}
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
                  {notification.message.content}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Find Your Trainer</h1>
          </div>
          <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

          {/* Search */}
          <div className="mt-8">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {/* Count */}
          <div className="mt-4 text-sm text-gray-600">
            {loading
              ? "Loading…"
              : `${items.length} trainer${items.length === 1 ? "" : "s"} found`}
          </div>

          {/* Trainers List */}
          <section className="mt-4 space-y-5">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-sm text-gray-600">
                No trainers match your search.
              </div>
            ) : (
              currentItems.map((t) => (
                <TrainerCard
                  key={String(t.id)}
                  trainer={t}
                  onPreview={(coach) => console.log("preview", coach.id)}
                />
              ))
            )}
          </section>

          {/* Pagination */}
          {!loading && items.length > trainersPerPage && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                Next
              </button>
            </div>
          )}

          <div className="pb-24 lg:pb-0" />
        </div>
      </main>
    </div>
  );
}
