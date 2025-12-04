"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import Sidebar from "../components/shared/sidebar";
import useGetUser from "../Hooks/useGetUser";
import { toast } from "react-toastify";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import useGetTheme from "../Hooks/useGetTheme";
import {
  Search,
  Paperclip,
  Smile,
  Send,
  ChevronLeft,
  RefreshCcw,
  Circle,
} from "lucide-react";


/* =========================
   Types
   ========================= */
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

const OnlineDot = ({ online }: { online: boolean }) => (
  <span
    className={[
      "inline-block h-2.5 w-2.5 rounded-full",
      online ? "bg-emerald-500" : "bg-zinc-400",
    ].join(" ")}
  />
);

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70 ${className}`}
  />
);

/* =========================
   Component
   ========================= */
const Chat = () => {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<LiteUser | null>(null);
  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeUsers, setActiveUsers] = useState<LiteUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const EMOJIS = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😅",
    "😊",
    "😍",
    "😘",
    "😎",
    "🤩",
    "😇",
    "😉",
    "🙃",
    "😋",
    "😏",
    "🥰",
    "🤗",
    "🤔",
    "😐",
    "😴",
    "😢",
    "😭",
    "😡",
    "🤯",
    "👍",
    "👎",
    "🙏",
    "💪",
    "🔥",
    "❤️",
  ];

  // WhatsApp style: either chat list or single chat screen
  const [view, setView] = useState<"list" | "chat">("list");

  const { userDB } = useGetUser();
  const { theme } = useGetTheme();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState<{
    user: LiteUser;
    message: ChatMessage;
  } | null>(null);

  const currentMessages = selectedUser ? chats[selectedUser.id] || [] : [];
  const [sender_id, setSenderId] = useState<string>();

  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  // 🔹 Hidden file input for "select media"
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload/send file to your API here
    toast.info(`Selected file: ${file.name}`);
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker((v) => !v);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };


  useEffect(() => {
    fetchUsers()
  },[])

  /* =========================
     Load users
     ========================= */
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const res = await fetch(
        "http://localhost:4000/api/v1/auth/getusers"
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const result = await res.json();
      if (!result || !result.data) throw new Error("Invalid response format");

      // const formattedUsers: LiteUser[] = result.data
      //   .map((user: { id: string; first_name: string; status: string }) => ({
      //     id: user.id,
      //     name: user.first_name || "Unknown",
      //     status: user.status || "online",
      //     avatar:
      //       user.first_name
      //         ?.split(" ")
      //         .map((n: string) => n[0])
      //         .join("") || "U",
      //   }))
      //   .filter(
      //     (user: { id: string; first_name: string; status: string }) =>
      //       user.id !== userDB?.data?.user_id
      //   );

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

  /* =========================
     Supabase realtime per conversation
     ========================= */
  // useEffect(() => {
  //   if (!conversationId) return;

  //   if (channelRef.current) {
  //     supabase.removeChannel(channelRef.current);
  //   }

  //   const channel = supabase
  //     .channel(`chat-${conversationId}`)
  //     .on("broadcast", { event: "new-message" }, (payload) => {
  //       const newMessage = payload.payload as ChatMessage;

  //       if (newMessage.sender_id === userDB?.data?.user_id) return;

  //       setChats((prev) => {
  //         const key = selectedUser?.id || "";
  //         const list = prev[key] || [];
  //         if (list.some((m) => m.id === newMessage.id)) return prev;
  //         // console.log(newMessage, "slkdjasdj");

  //         setSenderId(newMessage.sender_id);

  //         return { ...prev, [key]: [...list, newMessage] };
  //       });
  //     })
  //     .subscribe();

  //   channelRef.current = channel;
  //   return () => {
  //     if (channelRef.current) {
  //       supabase.removeChannel(channelRef.current);
  //       channelRef.current = null;
  //     }
  //   };
  // }, [conversationId, selectedUser?.id, userDB?.data?.user_id]);

  useEffect(() => {
    if (!conversationId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on("broadcast", { event: "new-message" }, (payload) => {
        const newMessage = payload.payload as ChatMessage;

        if (newMessage.sender_id === userDB?.data?.user_id) return;

        setChats((prev) => {
          const key = selectedUser?.id || "";
          const list = prev[key] || [];
          if (list.some((m) => m.id === newMessage.id)) return prev;
          console.log(newMessage, "slkdjasdj");

          setSenderId(newMessage.sender_id);

          // هنا نعمل notification
          const sender = activeUsers.find((u) => u.id === newMessage.sender_id);
          if (sender) {
            setNotification({ user: sender, message: newMessage });

            // نخفي notification بعد 3 ثواني
            setTimeout(() => setNotification(null), 3000);
          }

          return { ...prev, [key]: [...list, newMessage] };
        });
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, selectedUser?.id, userDB?.data?.user_id, activeUsers]);

  /* =========================
     Select a user / load conversation
     ========================= */
  const selectUser = async (user: LiteUser) => {
    try {
      setLoadingUserId(user.id);
      setSelectedUser(user);
      setView("chat");

      const response = await fetch(
        `http://localhost:4000/api/v1/chat/conversations/start/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDB?.data.access_token}`,
          },
        }
      );

      const result = await response.json();
      const convId = result?.data?.id;
      if (!convId) throw new Error("No conversation ID");

      setConversationId(convId);
      localStorage.setItem("conversation_id", convId);

      const messagesRes = await fetch(
        `http://localhost:4000/api/v1/chat/conversations/${convId}/messages`,
        { headers: { Authorization: `Bearer ${userDB?.data.access_token}` } }
      );
      const messagesData = await messagesRes.json();

      setChats((prev) => ({ ...prev, [user.id]: messagesData.data || [] }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load conversation");
    } finally {
      setLoadingUserId(null);
    }
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [currentMessages]);

  /* =========================
     Send message
     ========================= */
  const sendMessage = async () => {
    if (!selectedUser) return toast.error("Select a user first.");
    if (!message.trim()) return;

    try {
      const token = userDB?.data?.access_token;
      if (!token) return toast.error("You're not logged in.");

      const res = await fetch(
        "http://localhost:4000/api/v1/chat/messages/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipient_id: selectedUser.id,
            content: message,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to send message");

      const newMessage: ChatMessage = {
        id: result?.data?.message?.id || Date.now(),
        user: "You",
        avatar: "ME",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        content: message,
        sender_id: userDB?.data?.user_id,
        likes: 0,
        replies: 0,
        created_at: new Date().toISOString(),
        conversation_id: conversationId || undefined,
      };

      setChats((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

      if (conversationId) {
        await supabase.channel(`chat-${conversationId}`).send({
          type: "broadcast",
          event: "new-message",
          payload: newMessage,
        });
      }

      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  /* =========================
     Helpers for WhatsApp-like list
     ========================= */
  const getLastMessageForUser = (userId: string) => {
    const list = chats[userId];
    if (!list || list.length === 0) return undefined;
    return list[list.length - 1];
  };

  const formatTime = (iso?: string, fallback?: string) => {
    if (!iso && !fallback) return "";
    if (!iso) return fallback ?? "";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goBackToList = () => {
    setView("list");
  };

  console.log(activeUsers, "Selected");

  /* =========================
     Render
     ========================= */
  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>

      {/* main is full-height and non-scrollable, inner sections scroll */}
      <main
        style={shellVars}
        className="
          w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))]
          lg:ml-[calc(var(--sb-w)+var(--extra-left))]
          flex flex-col
          min-h-screen max-h-screen
          px-3 sm:px-4 md:px-6
          overflow-hidden
        "
      >
        {/* Top bar */}
        <div className="py-3 sm:py-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {view === "list" ? "Chats" : "Chat"}
            </h1>

            {view === "list" && (
              <div className="flex items-center gap-2">
                {/* Mobile: circular icon button only */}
                <button
                  onClick={fetchUsers}
                  className="
                    inline-flex sm:hidden items-center justify-center
                    h-9 w-9 rounded-full border border-zinc-200
                    bg-white dark:bg-zinc-900
                    text-zinc-600 dark:text-zinc-200
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition
                  "
                  aria-label="Refresh"
                  type="button"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>

                {/* Desktop: pill with icon + text */}
                <button
                  onClick={fetchUsers}
                  type="button"
                  className="
    hidden sm:inline-flex items-center gap-2 rounded-full
    bg-rose-500 px-6 py-2 text-xs sm:text-sm font-medium
    shadow-sm cursor-pointer hover:bg-rose-400 active:scale-95
    transition text-white
  "
                >
                  <RefreshCcw className="h-4 w-4 text-white dark:text-black" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content area fills viewport and scrolls internally */}
        <div className="flex-1 flex overflow-hidden">
          {/* ============ VIEW 1: CHAT LIST (WhatsApp home) ============ */}
          {view === "list" && (
            <section
              className="
                w-full
                rounded-2xl border border-zinc-200 dark:border-zinc-800
                bg-white dark:bg-zinc-900 shadow-sm
                flex flex-col
                overflow-hidden
              "
            >
              {/* Search (fixed inside component) */}
              <div className="px-3 pb-2 pt-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="
                      w-full rounded-full border border-zinc-200 dark:border-zinc-700
                      bg-white dark:bg-zinc-900 pl-9 pr-3 py-2
                      text-xs sm:text-sm outline-none
                      focus:border-rose-500 focus:ring-1 focus:ring-rose-500
                    "
                    onChange={(e) => {
                      const q = e.target.value.toLowerCase();
                      const filtered = activeUsers.filter((u) =>
                        u.name.toLowerCase().includes(q)
                      );
                      if (q) setActiveUsers(filtered);
                      else fetchUsers();
                    }}
                  />
                </div>
              </div>

              {/* List of chats (scrolls) */}
              <div className="px-2 pt-1 pb-24 flex-1 overflow-y-auto">
                {loadingUsers ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[60px]" />
                    <Skeleton className="h-[60px]" />
                    <Skeleton className="h-[60px]" />
                  </div>
                ) : error ? (
                  <div className="text-sm text-red-500 text-center py-6">
                    {error}
                  </div>
                ) : activeUsers.length === 0 ? (
                  <div className="text-sm text-zinc-500 text-center py-6">
                    No users available
                  </div>
                ) : (
                  activeUsers.map((user) => {
                    const last = getLastMessageForUser(user.id);
                    const preview =
                      last?.content ??
                      (user.status === "online"
                        ? "Tap to start chatting"
                        : "No messages yet");
                    const timeLabel = formatTime(
                      last?.created_at,
                      last?.time || ""
                    );

                    return (
                      <button
                        key={user.id}
                        onClick={() => selectUser(user)}
                        type="button"
                        className="
                          w-full flex items-center gap-3
                          px-3 py-2.5 rounded-2xl
                          hover:bg-zinc-50 dark:hover:bg-zinc-800/70
                          transition text-left
                        "
                      >
                        <div className="relative shrink-0">
                          <div className="relative shrink-0">
                            {/* Avatar Circle */}
                            <div className="h-10 w-10 rounded-full bg-rose-500 overflow-hidden flex items-center justify-center text-white font-semibold text-sm">
                              {user.avatar.startsWith("http") ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span>{user.avatar}</span>
                              )}
                            </div>

                            {/* Online Dot */}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5">
                            <OnlineDot online={user.status === "online"} />
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold">
                              {user.name}
                            </p>
                            {timeLabel && (
                              <span className="text-[10px] text-zinc-400">
                                {timeLabel}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                            {preview}
                          </p>
                        </div>

                        {loadingUserId === user.id && (
                          <span className="text-[10px] text-zinc-400 animate-pulse">
                            …
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* ============ VIEW 2: SINGLE CHAT (full-width) ============ */}
          {view === "chat" && (
            <section
              className="
      w-full
      rounded-2xl border border-zinc-200 dark:border-zinc-800
      bg-white dark:bg-zinc-900 shadow-sm
      flex flex-col
      overflow-hidden
      pb-20 lg:pb-0
    "
            >
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

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Header */}
              <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <button
                  onClick={goBackToList}
                  type="button"
                  className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 mr-1"
                  aria-label="Back to chats"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {selectedUser ? (
                  <>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white text-sm font-semibold overflow-hidden">
                      {selectedUser.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{selectedUser.name?.[0] || "U"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm sm:text-base font-semibold">
                          {selectedUser.name}
                        </p>
                        <Circle
                          className={[
                            "h-2.5 w-2.5",
                            selectedUser.status === "online"
                              ? "text-emerald-500"
                              : "text-zinc-400",
                          ].join(" ")}
                          fill="currentColor"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {selectedUser.status === "online"
                          ? "Online"
                          : "Last seen recently"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Select a chat from the list
                  </p>
                )}
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 pb-4 sm:pb-6"
              >
                {currentMessages.map((msg) => {
                  const mine = msg.sender_id === userDB?.data?.user_id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={[
                          "max-w-[85%] sm:max-w-[75%] md:max-w-[60%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed break-words",
                          mine
                            ? "bg-emerald-500 text-white rounded-br-none"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-bl-none",
                        ].join(" ")}
                      >
                        {!mine && (
                          <p className="mb-0.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                            {selectedUser?.name}
                          </p>
                        )}
                        <div
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                        <p
                          className={[
                            "mt-1 text-[10px] text-right",
                            mine
                              ? "text-emerald-100"
                              : "text-zinc-500 dark:text-zinc-400",
                          ].join(" ")}
                        >
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : msg.time || ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              {selectedUser && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-3 sm:px-4 py-3 sm:py-3.5 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 sm:px-3 py-1.5">
                    <input
                      className="flex-1 bg-transparent px-1 text-sm outline-none"
                      placeholder={`Message ${selectedUser.name}…`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <div className="relative">
                      <button
                        type="button"
                        className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        aria-label="Emoji"
                        onClick={handleEmojiClick}
                      >
                        <Smile className="h-5 w-5 text-zinc-500" />
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-10 right-0 z-20 w-52 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg p-2 grid grid-cols-8 gap-1">
                          {EMOJIS.map((e) => (
                            <button
                              key={e}
                              type="button"
                              className="text-xl leading-none rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"
                              onClick={() => handleEmojiSelect(e)}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={sendMessage}
                      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-600 active:scale-95 transition"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
