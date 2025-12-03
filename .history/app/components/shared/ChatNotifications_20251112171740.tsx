"use client"; // ضروري عشان الـ component client-side (للـ useEffect و Supabase)

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import useGetUser from "@/app/Hooks/useGetUser";
import { GetUserById } from "@/app/services/Auth.service";
import axios from "axios";

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

export default function ChatNotifications() {
  const { userDB } = useGetUser(); // استخدم الـ hook بتاعك للـ user

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

  useEffect(() => {
    if (!userDB?.data?.user_id) return;

    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe/${userId}`
        );
        console.log("Fetched subscriptions:", response.data);
        // تقدر هنا تعمل setState(response.data) مثلاً لو محتاج تحفظها
      } catch (err) {
        console.error("❌ Error fetching subscriptions:", err);
      }
    };

    // أول fetch فوري
    void fetchSubscriptions();

    // إعادة التنفيذ كل 20 ثانية
    const interval = setInterval(fetchSubscriptions, 20000);

    // تنظيف الـ interval لما الـ component يتفصل
    return () => clearInterval(interval);
  }, [userId]);

  // Fetch users
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
        .filter((user: LiteUser) => user.id !== userDB?.data?.user_id)
        .sort((a: { status: string }, b: { status: string }) =>
          a.status === "online" ? -1 : 1
        );

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

  // Fetch sender user (optional)
  useEffect(() => {
    const fetchUser = async () => {
      if (sender_id) {
        await GetUserById(sender_id); // لو مش مستخدم، أزل ده
      }
    };
    fetchUser();
  }, [sender_id]);

  // Fetch conversations
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

  // Subscribe to channels
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

          // Update chats optionally
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

  // Render the notification UI only
  return (
    <>
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
            <p className="text-sm font-semibold">{notification.user.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {notification.message.content}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
