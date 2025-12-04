"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Sidebar from "../components/shared/sidebar";
import CreatePostModal, { CreatePostType } from "./components/createPost";
import { GetAllPosts } from "../sign-up/Services/posts.service";
import useGetUser from "../Hooks/useGetUser";
import { Post } from "../types/type";
import { useComments } from "./context/CommentsContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { GetUserById } from "../services/Auth.service";

function Tag({ label, count }: { label: string; count?: number }) {
  return (
    <button className="text-xs sm:text-[13px] rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
      #{label} {typeof count === "number" ? `(${count})` : ""}
    </button>
  );
}

interface CommentFormData {
  comment: string;
}

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

export default function CommunityPage() {
  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  const [feedTab, setFeedTab] = useState<"trending" | "new">("trending");

  // NEW: modal open state
  const [openCreate, setOpenCreate] = useState(false);
  const [Posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // NEW: submit handler for modal
  async function handleCreateSubmit(data: CreatePostType) {
    // TODO: call your API here
    console.log("CreatePost payload:", data);
    // optionally optimistically add to feed here
  }
  const { userDB } = useGetUser();

  const { openPostId, addComment, handleTriggerOpenCommentModal } =
    useComments();

  const fetchGetPosts = async () => {
    setLoading(true);
    try {
      const response = await GetAllPosts();
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetPosts();
  }, [userDB?.data?.user_id]);

  console.log(Posts, "sadasdsada");

  const { register, handleSubmit, reset } = useForm<CommentFormData>();

  // console.log(Posts);

  // Notification logic states
  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeUsers, setActiveUsers] = useState<LiteUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState<{
    user: LiteUser;
    message: ChatMessage;
  } | null>(null);

  const [sender_id, setSenderId] = useState<string>();
  const [conversations, setConversations] = useState<string[]>([]); // list من conversation IDs
  const channelsRef = useRef<RealtimeChannel[]>([]); // لتخزين الـ channels عشان unsubscribe لاحقًا

  /* =========================
     Load users
     ========================= */
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

  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(sender_id as string);
      // setUser(data); // لاحظ: لم تستخدم الـ user في الكود، يمكن إزالته إذا غير ضروري
    };

    if (sender_id) fetchUser();
  }, [sender_id]);

  // useEffect جديد لجلب الـ conversations
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
        const convIds = data.data.map((conv: { id: string }) => conv.id); // افترض إن الـ API يرجع list من {id: string, ...}
        setConversations(convIds);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
        //  // toast.error("Failed to load conversations");
      }
    };

    fetchConversations();
  }, [userDB?.data?.user_id, userDB?.data.access_token]);

  useEffect(() => {
    if (openCreate) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Apply lock to body
      document.body.style.setProperty("--scroll-y", `${scrollY}px`);
      document.body.classList.add("no-scroll");
    } else {
      // Restore scroll
      const scrollY =
        document.body.style.getPropertyValue("--scroll-y") || "0px";
      document.body.classList.remove("no-scroll");

      // Smooth snap back
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("no-scroll");
      document.body.style.removeProperty("--scroll-y");
    };
  }, [openCreate]);

  // useEffect لإنشاء channels لكل conversation
  useEffect(() => {
    if (conversations.length === 0 || !userDB?.data?.user_id) return;

    // Unsubscribe من channels قديمة
    channelsRef.current.forEach((channel) => supabase.removeChannel(channel));
    channelsRef.current = [];

    conversations.forEach((convId) => {
      const channel = supabase
        .channel(`chat-${convId}`)
        .on("broadcast", { event: "new-message" }, (payload) => {
          const newMessage = payload.payload as ChatMessage;
          if (newMessage.sender_id === userDB?.data?.user_id) return;

          // هنا نفس الكود: setSenderId, setNotification, إلخ
          setSenderId(newMessage.sender_id);
          const sender = activeUsers.find((u) => u.id === newMessage.sender_id);
          if (sender) {
            setNotification({ user: sender, message: newMessage });
            setTimeout(() => setNotification(null), 3000);
          }

          // اختياري: حدث الـ chats إذا كنت عايز (لكن في الصفحة دي مش ضروري إلا لو عايز تخزن الرسائل)
          setChats((prev) => {
            const key = newMessage.sender_id; // أو أي key مناسب
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
          {/* Title + Post button */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Community</h1>

            <button
              className="rounded-xl bg-rose-500 text-white text-1xl px-10 py-3 hover:bg-rose-600"
              onClick={() => setOpenCreate(true)}
            >
              + Post
            </button>
          </div>
          <div className="mt-5 h-[2px] w-full bg-gray-200 rounded-full" />

          {/* Trending topics */}
          <section className="mt-5 justify-between ">
            {/* <h2 className="text-0xl font-bold text-gray-700 mb-5 ">
              Trending Topics
            </h2> */}
            {/* <div className="flex flex-wrap gap-2">
              <Tag label="StrengthTraining" count={234} />
              <Tag label="Nutrition" count={156} />
              <Tag label="MorningWorkout" count={89} />
            </div> */}
          </section>

          {/* Tabs */}
          <section className="mt-4  justify-center">
            {/* Segmented control */}
            <div className="w-full max-w-md justify-center">
              <div
                className="relative grid grid-cols-2 rounded-full bg-gray-100 p-1"
                role="tablist"
                aria-label="Feed filter"
              >
                {/* sliding white pill */}
                <span
                  className={[
                    "absolute inset-y-1 left-1 w-1/2 rounded-full bg-white shadow-sm",
                    "transition-transform duration-200 ease-out",
                    feedTab === "trending"
                      ? "translate-x-0"
                      : "translate-x-full",
                  ].join(" ")}
                  aria-hidden
                />

                {/* Trending */}
                <button
                  role="tab"
                  aria-selected={feedTab === "trending"}
                  onClick={() => setFeedTab("trending")}
                  className={[
                    "relative z-10 py-2 text-center text-sm font-semibold",
                    "transition-colors",
                    feedTab === "trending" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  Trending
                </button>

                {/* New */}
                <button
                  role="tab"
                  aria-selected={feedTab === "new"}
                  onClick={() => setFeedTab("new")}
                  className={[
                    "relative z-10 py-2 text-center text-sm font-semibold",
                    "transition-colors",
                    feedTab === "new" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  New
                </button>
              </div>
            </div>
          </section>

          {/* Notification UI */}
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

                {/* Online Dot - اختياري */}
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

          {/* Feed */}
          <section className="mt-5 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                {/* أو استخدم أي loader component عندك */}
              </div>
            ) : (
              <>
                
              </>
            )}
          </section>

          {/* bottom padding so content isn't hidden behind bottom nav on mobile */}
          <div className="pb-24 lg:pb-0" />
        </div>
      </main>

      {/* ===== Create Post Modal (mounted at page root) ===== */}
      <CreatePostModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        user={{
          name: "Youssef Tarek",
          subtitle: "Share with your community",
          // avatarUrl: "/avatar-1.jpg", // optional; show initials if missing
        }}
      />
    </div>
  );
}
