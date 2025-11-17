/* eslint-disable @typescript-eslint/no-explicit-any */
// app/community/page.tsx
"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Sidebar from "../components/shared/sidebar";
import CreatePostModal from "./components/createPost";
import EditPostModal from "./components/editPost";
import { GetAllPosts } from "../sign-up/Services/posts.service";
import useGetUser from "../Hooks/useGetUser";
import { Post, InterestType } from "../types/type";
import { useComments } from "./context/CommentsContext";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { GetUserById } from "../services/Auth.service";
import {
  SharePostToUser,
  togglePostLike,
  UpdatePost,
} from "./Service/posts.service";
import { GetAllInterests } from "../sign-up/Services/Interest.service";

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

  // Modal states
  const [openCreate, setOpenCreate] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);

  const [newPosts, setNewPosts] = useState<Post[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);

  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  const [Posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
const [interests, setInterests] = useState<InterestType[]>([]);
const [commentLoveColor, setCommentLoveColor] = useState(false);
  async function handleCreateSubmit(data: CreatePostType) {
    console.log("CreatePost payload:", data);
  }

  const { userDB } = useGetUser();
  const { openPostId, addComment, handleTriggerOpenCommentModal } =
    useComments();
  const { register, handleSubmit, reset } = useForm<CommentFormData>();

  // Fetch posts
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

  // Fetch interests
  const fetchInterests = async () => {
    try {
      const data = await GetAllInterests();
      setInterests(data);
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  useEffect(() => {
    fetchGetPosts();
    fetchInterests();
  }, [userDB?.data?.user_id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpenId) {
        setDropdownOpenId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpenId]);

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
  const [conversations, setConversations] = useState<string[]>([]);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  // Load users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

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

  let channel: RealtimeChannel;

  useEffect(() => {
    const handleChangeCommunity = async () => {
      channel = await supabase
        .channel("community-realTime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts" },
          async (payload) => {
            console.log("New post:", payload.new);

            const post = payload.new;

            if (post && typeof post === "object" && "user_id" in post) {
              const userRes = await GetUserById(post.user_id as string);
              const postWithUser = {
                ...post,
                users: userRes?.data,
              };
              setNewPosts((prev) => [postWithUser as Post, ...prev]);
              setNewPostsCount((prev) => prev + 1);
            }
          }
        )
        .subscribe();
    };

    handleChangeCommunity();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userDB?.data?.user_id) fetchUsers();
  }, [userDB?.data?.user_id]);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await GetUserById(sender_id as string);
    };

    if (sender_id) fetchUser();
  }, [sender_id]);

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

  useEffect(() => {
    if (openCreate) {
      const scrollY = window.scrollY;
      document.body.style.setProperty("--scroll-y", `${scrollY}px`);
      document.body.classList.add("no-scroll");
    } else {
      const scrollY =
        document.body.style.getPropertyValue("--scroll-y") || "0px";
      document.body.classList.remove("no-scroll");
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      document.body.classList.remove("no-scroll");
      document.body.style.removeProperty("--scroll-y");
    };
  }, [openCreate]);

  // Subscribe to realtime channels
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

  // Get display name
  const typedUser = userDB?.data;
  const users = typedUser?.user;
  const email = typedUser?.email ?? "";
  const displayName = (() => {
    const raw =
      `${users?.first_name ?? ""} ${users?.second_name ?? ""}`.trim() ||
      (email ? email.split("@")[0] : "") ||
      "User";
    return raw
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  })();

  // Handle update post
  const handleUpdatePost = async (data: CreatePostType) => {
    if (!postToEdit) return;

    try {
      await UpdatePost(postToEdit.id, {
        ...data,
        user_id: userDB?.data?.user_id || "",
      });

      toast.success("Post updated successfully!");
      await fetchGetPosts();
      setEditModalOpen(false);
      setPostToEdit(null);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      // await handleDeletePost(postId);
      toast.success("Post deleted successfully!");
      await fetchGetPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>

      {newPostsCount > 0 && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => {
              setPosts((prev) => [...newPosts, ...prev]);
              setNewPosts([]);
              setNewPostsCount(0);

              // scroll smooth
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className=" bg-[#ff1f57] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#ff1f5794] transition"
          >
            {newPostsCount} New Post{newPostsCount > 1 ? "s" : ""} – Click to
            view
          </button>
        </div>
      )}

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
                    alt={u.name}
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

          {/* Tabs */}
          <section className="mt-4 justify-center">
            <div className="w-full justify-center">
              <div
                className="relative grid rounded-full bg-gray-100 p-1"
                role="tablist"
                aria-label="Feed filter"
              >
                <span
                  className={[
                    "absolute inset-y-1 w-full rounded-full bg-white shadow-sm",
                    "transition-transform duration-200 ease-out",
                    feedTab === "trending"
                      ? "translate-x-0"
                      : "translate-x-full",
                  ].join(" ")}
                  aria-hidden
                />

                <button
                  role="tab"
                  aria-selected={feedTab === "trending"}
                  onClick={() => setFeedTab("trending")}
                  className={[
                    "relative z-10 py-2 px-1.5 justify-center font-semibold",
                    "transition-colors",
                    feedTab === "trending" ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  Explore new Feed
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

                        setPosts((prev) =>
                          prev.map((p) =>
                            p.id === post.id
                              ? {
                                  ...p,
                                  liked_by: res.liked_by,
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
                      // <Link
                      //   href={`/community/${post.id}`}
                      //   key={post.id}
                      //   className="cursor-pointer"
                      // >
                      <div
                        onClick={() => {
                          console.log(post, "Post");
                        }}
                        className="mb-4 sm:mb-6"
                      >
                        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {post.users?.avatar_url ? (
                                <img
                                  src={post.users?.avatar_url}
                                  alt={post.users?.first_name}
                                  width={40}
                                  height={40}
                                  className="rounded-full h-10 object-cover w-10"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
                                  {post.users?.first_name
                                    ?.split(" ")
                                    .map((p) => p[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                              )}

                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm sm:text-[15px]">
                                      {`${post.users?.first_name} ${post.users?.second_name}`}
                                    </span>
                                    <span className="text-sm text-[gray] font-semibold">
                                      userName: {post.users.username || ""}
                                    </span>
                                  </div>
                                  {post.users?.user_type && (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                      {post.users?.user_type}
                                    </span>
                                  )}
                                  {/* <span className="text-[11px] text-rose-500">
                                      ↗
                                    </span> */}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(post.created_at).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Three dots menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDropdownOpenId(
                                    dropdownOpenId === post.id ? null : post.id
                                  );
                                }}
                                className="text-gray-400 hover:text-gray-600 p-2"
                                aria-label="More options"
                              >
                                •••
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

                            {/* Comment Modal */}
                            {openPostId === post.id && (
                              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div
                                  className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"

                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between p-4 shrink-0">
                                    <h2 className="text-xl font-bold">
                                      Comments
                                    </h2>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleTriggerOpenCommentModal("0");
                                      }}
                                      className="w-9 h-9 rounded-full hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Comments List */}
                                  <div className="overflow-y-auto flex-1 p-4 space-y-4">
                                    {post.comment_new &&
                                    post.comment_new.length > 0 ? (
                                      post.comment_new.map((comment: any) => (
                                        <div
                                          key={comment.id}
                                          className="flex gap-3"
                                        >
                                          <img
                                            src={
                                              comment.user?.avatar_url ||
                                              "https://via.placeholder.com/40"
                                            }
                                            alt={comment.user?.first_name}
                                            className="w-10 h-10 rounded-full shrink-0"
                                          />
                                          <div className="flex-1">
                                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                              <div className="font-bold text-sm mb-1">
                                                {comment.user?.first_name}{" "}
                                                {comment.user?.second_name}
                                              </div>
                                              <p className="text-sm leading-relaxed">
                                                {comment.comment}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 px-2">
                                              {/* <span className="text-xs text-gray-500">
                                                {comment.created_at}
                                              </span> */}

                                              <button
                                                className="flex items-center gap-1 text-xs transition"
                                                onClick={() =>
                                                  setCommentLoveColor(
                                                    (prev) => !prev
                                                  )
                                                }
                                              >
                                                <svg
                                                  className="w-4 h-4"
                                                  fill={
                                                    commentLoveColor
                                                      ? "red"
                                                      : "none"
                                                  }
                                                  stroke={
                                                    commentLoveColor
                                                      ? "red"
                                                      : "currentColor"
                                                  }
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                  />
                                                </svg>

                                                <span
                                                  className={
                                                    commentLoveColor
                                                      ? "text-red-500"
                                                      : "text-gray-500"
                                                  }
                                                >
                                                  0
                                                </span>
                                              </button>

                                              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium transition">
                                                Reply
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-8 text-gray-500">
                                        <p>No comments yet</p>
                                        <p className="text-sm mt-1">
                                          Be the first to comment!
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Input Section */}
                                  <div className="p-4 shrink-0 bg-gray-50">
                                    <div className="flex gap-3 items-start">
                                      <img
                                        src={
                                          userDB?.data.user?.avatar_url ||
                                          "https://via.placeholder.com/40"
                                        }
                                        alt="Your avatar"
                                        className="w-10 h-10 rounded-full shrink-0"
                                      />
                                      <div className="flex-1 flex gap-2">
                                        <input
                                          {...register("comment")}
                                          type="text"
                                          placeholder="Write a comment..."
                                          className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-red-500 transition"
                                          onKeyPress={(e) => {
                                            if (
                                              e.key === "Enter" &&
                                              !e.shiftKey
                                            ) {
                                              e.preventDefault();
                                              handleSubmit(handleAddComment)(e);
                                            }
                                          }}
                                        />
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSubmit(handleAddComment)(e);
                                          }}
                                          className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transition shrink-0"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                          </svg>
                                        </button>

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
                            </div>)

                                    
                          )}
                        </article>
                      </div>
                      // </Link>
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
        {editModalOpen && postToEdit && (
          <EditPostModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setPostToEdit(null);
            }}
            post={postToEdit}
            userName={displayName}
            userId={userDB?.data?.user_id || ""}
            onUpdate={handleUpdatePost}
          />
        )}
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
