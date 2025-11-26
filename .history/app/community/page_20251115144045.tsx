"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Sidebar from "../components/shared/sidebar";
import CreatePostModal from "./components/createPost";
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
import { SharePostToUser, togglePostLike } from "./Service/posts.service";

function Tag({ label, count }: { label: string; count?: number }) {
  return (
    <button className="text-xs sm:text-[13px] rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
      #{label} {typeof count === "number" ? `(${count})` : ""}
    </button>
  );
}

interface CreatePostType {
  bio: string;
  image: string;
  location: string;
  tags: string[];
  watch: string;
  user_id: string;
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

  const [feedTab, setFeedTab] = useState<"trending">("trending");

  // NEW: modal open state
  const [openCreate, setOpenCreate] = useState(false);
  const [Posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);

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
        "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/getusers"
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
    const handleChangeCommunity = async() => {

    }
  },[])

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
          "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/chat/conversations",
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
      {shareModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-4 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">Share Post</h2>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {activeUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={async () => {
                    const res = await SharePostToUser(
                      sharePostId as string,
                      u.id
                    );

                    toast.success("Post shared!");
                    setShareModalOpen(false);

                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === sharePostId
                          ? { ...p, share_count: res.share_count }
                          : p
                      )
                    );
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={u.avatar}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main
        style={shellVars}
        className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
          {/* Title + Post button */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Community</h1>

            <button
              className="rounded-xl bg-rose-500 cursor-pointer text-white text-1xl px-10 py-3 hover:bg-rose-600"
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
            <div className="w-full  justify-center">
              <div
                className="relative grid  rounded-full bg-gray-100 p-1"
                role="tablist"
                aria-label="Feed filter"
              >
                {/* sliding white pill */}
                <span
                  className={[
                    "absolute inset-y-1  w-full rounded-full bg-white shadow-sm",
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
                    "relative z-10 py-2 px-1.5 justify-center  font-semibold",
                    "transition-colors",
                    feedTab === "trending" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  Explore new Feed
                </button>

                {/* New */}
                {/* <button
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
                </button> */}
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
                {Array.isArray(Posts) && Posts.length > 0 ? (
                  Posts.map((post) => {
                    const handleAddComment = async (data: CommentFormData) => {
                      if (!data.comment?.trim()) return;

                      try {
                        await addComment(
                          post.id,
                          data.comment,
                          userDB?.data?.user_id as string
                        );

                        // ✅ refetch posts so comment count updates
                        await fetchGetPosts();

                        reset();
                        handleTriggerOpenCommentModal("0");
                      } catch (error) {
                        console.error("Error adding comment:", error);
                      }
                    };

                    const isLikedByMe = post.liked_by?.includes(
                      userDB?.data?.user_id as string
                    );

                    const likesCount = post.liked_by?.length || 0;

                    const handleToggleLike = async () => {
                      if (!userDB?.data?.user_id) return;

                      try {
                        const res = await togglePostLike(
                          post.id as string,
                          userDB.data.user_id as string
                        );

                        // Update local state optimistically with backend response
                        setPosts((prev) =>
                          prev.map((p) =>
                            p.id === post.id
                              ? {
                                  ...p,
                                  liked_by: res.liked_by, // updated array from backend
                                }
                              : p
                          )
                        );
                      } catch (error) {
                        console.error("Error toggling like:", error);
                        toast.error("Failed to like post");
                      }
                    };

                    return (
                      <Link
                        href={`/community/${post.id}`}
                        key={post.id}
                        className="cursor-pointer"
                      >
                        {/* <PostCard
                          post={post}
                          author={{
                            name:
                              post?.users?.first_name +
                                " " +
                                post?.users?.second_name || "",
                            role: post?.users?.user_type || "Coach",
                            avatar:
                              post.users?.avatar_url ||
                              "https://example.com/images/sunset.jpg",
                          }}
                          timeAgo={post.created_at}
                          content={post.bio}
                          image={
                            post.image || "https://example.com/images/sunset.jpg"
                          }
                          stats={{
                            likes: 145,
                            comments: post?.comment_new?.length,
                            shares: 8,
                          }}
                        /> */}

                        <div key={post.id} className="mb-4 sm:mb-6">
                          <article className="rounded-2xl border border-gray-200  bg-white p-4 sm:p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {userDB?.data?.user ? (
                                  <img
                                    src={
                                      post.users?.avatar_url ||
                                      "https://example.com/images/sunset.jpg"
                                    }
                                    alt={
                                      userDB?.data?.user?.first_name ||
                                      "https://example.com/images/sunset.jpg"
                                    }
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
                                    {userDB?.data?.user?.first_name
                                      .split(" ")
                                      .map((p) => p[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </div>
                                )}

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm sm:text-[15px]">
                                      {`${post.users?.first_name} ${post.users?.second_name}`}
                                    </span>
                                    {userDB?.data?.user?.user_type && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                        {userDB?.data?.user?.user_type}
                                      </span>
                                    )}
                                    <span className="text-[11px] text-rose-500">
                                      ↗
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {post.created_at}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="More"
                              >
                                •••
                              </button>
                            </div>

                            {/* Body */}
                            <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">
                              {post.bio}
                            </div>

                            {post.image && (
                              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                                <img
                                  src={
                                    post.image ||
                                    "https://example.com/images/sunset.jpg"
                                  }
                                  alt={"post image"}
                                  width={1200}
                                  height={800}
                                  className="w-full h-64 sm:h-72 object-cover"
                                />
                              </div>
                            )}

                            {/* Footer stats */}
                            <div className="mt-3 flex items-center gap-6 text-gray-500">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleToggleLike();
                                }}
                                className={[
                                  "inline-flex items-center gap-1.5 transition-colors",
                                  isLikedByMe
                                    ? "text-rose-600"
                                    : "text-gray-500 hover:text-rose-600",
                                ].join(" ")}
                              >
                                <span>{isLikedByMe ? "❤️" : "🤍"}</span>
                                <span className="text-sm">{likesCount}</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleTriggerOpenCommentModal(post.id);
                                }}
                                className="inline-flex cursor-pointer items-center gap-1.5 hover:text-gray-700 transition-colors"
                              >
                                <span>💬</span>
                                <span className="text-sm">
                                  {post.comment_new?.length}
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSharePostId(post.id);
                                  setShareModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                              >
                                <span>↗</span>
                                <span className="text-sm">
                                  {post.share_count}
                                </span>
                              </button>
                            </div>

                            {/*Comment Modal*/}

                            {openPostId === post.id && (
                              <div className="fixed inset-0 bg-black/1 backdrop-blur-sm z-50 gap-2 flex items-center justify-center p-4">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // handle like logic
                                  }}
                                  className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                                >
                                  <span>❤️</span>
                                  <span className="text-sm">{20}</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTriggerOpenCommentModal(post.id);
                                  }}
                                  className="inline-flex cursor-pointer items-center gap-1.5 hover:text-gray-700 transition-colors"
                                >
                                  <span>💬</span>
                                  <span className="text-sm">
                                    {post.comment_new?.length}
                                  </span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // handle share logic
                                  }}
                                  className="inline-flex items-center gap-1.5 hover:text-gray-700 transition-colors"
                                >
                                  <span>↗</span>
                                  <span className="text-sm">{10}</span>
                                </button>
                              </div>
                            )}

                            {/*Comment Modal*/}

                            {openPostId === post.id && (
                              <div className="fixed inset-0 bg-black/1 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div
                                  className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between p-4 border-b">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleTriggerOpenCommentModal("0");
                                      }}
                                      className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                                      </svg>
                                    </button>

                                    {/* <button className="text-blue-500 text-sm font-medium hover:underline">
                                      Drafts
                                    </button> */}
                                  </div>

                                  {/* Content */}
                                  <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                                    {/* Original Post */}
                                    <div className="p-4 flex gap-3">
                                      <img
                                        src={
                                          post.users?.avatar_url ||
                                          "https://via.placeholder.com/40"
                                        }
                                        alt="User"
                                        className="w-10 h-10 rounded-full"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-1 mb-1">
                                          <span className="font-bold text-sm">
                                            {post.users?.first_name}
                                          </span>
                                          <svg
                                            className="w-4 h-4 text-yellow-500"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M8.5 12.5l2 2 5-5" />
                                          </svg>
                                          <span className="text-gray-500 text-sm">
                                            @{post.location}
                                          </span>
                                        </div>
                                        <p className="text-sm text-right leading-relaxed">
                                          {post?.bio}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Reply Section */}
                                    <div className="px-4 pb-4">
                                      <div className="flex gap-3">
                                        <div className="w-10 flex flex-col items-center">
                                          <div className="w-0.5 h-full bg-gray-300"></div>
                                        </div>
                                      </div>

                                      <div className="flex gap-3">
                                        {/* <img
                                          src={ post.users?.avatar_url||"https://via.placeholder.com/40"}
                                          alt="Your profile"
                                          className="w-10 h-10 rounded-full"
                                        /> */}
                                        <div className="flex-1">
                                          <textarea
                                            {...register("comment")}
                                            placeholder="Post your reply"
                                            className="w-full min-h-[100px] text-lg outline-none resize-none"
                                            autoFocus
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Footer */}
                                  <div className="border-t p-4">
                                    <div className="flex items-center justify-end">
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleSubmit(handleAddComment)(e);
                                        }}
                                        className="bg-blue-500  hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full transition"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </article>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500">No posts yet</p>
                )}
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
