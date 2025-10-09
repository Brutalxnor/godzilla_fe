"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import useGetUser from "../Hooks/useGetUser";
import { toast } from "react-toastify";
import { supabase } from "@/lib/client";

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
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    status: string;
    avatar: string;
  } | null>(null);
  const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeUsers, setActiveUsers] = useState<
    { id: string; name: string; status: string; avatar: string }[]
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);

  // 🧠 عند أول تحميل للمكون
  useEffect(() => {
    const storedId = localStorage.getItem("conversation_id");
    if (storedId) {
      setConversationId(storedId);
    }
  }, []);

  // ✅ جلب المستخدمين من API
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

      const formattedUsers = result.data.map(
        (user: { id: string; first_name: string; status: string }) => ({
          id: user.id,
          name: user.first_name || "Unknown",
          status: user.status || "online",
          avatar:
            user.first_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("") || "U",
        })
      );

      setActiveUsers(formattedUsers);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error sending message:", err.message);
      } else {
        console.error("❌ Unknown error:", err);
      }
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages")
      // .on(
      //   "postgres_changes",
      //   {
      //     event: "*", // INSERT, UPDATE, DELETE لو حبيت تخصص
      //     schema: "public",
      //     table: "messages",
      //   },
      //   (payload) => {
      //     console.log("New message event:", payload);

      //     if (payload.eventType === "INSERT") {
      //       const newMessage = payload.new;

      //       setChats((prevChats) => {
      //         const conversationId = newMessage.conversation_id;
      //         return {
      //           ...prevChats,
      //           [conversationId]: [
      //             ...(prevChats[conversationId] || []),
      //             newMessage,
      //           ],
      //         };
      //       });
      //     }
      //   }
      // )

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log("New message event:", payload);

          if (payload.eventType === "INSERT") {
            const newMessage = payload.new;

            setChats((prevChats) => {
              const conversationId = newMessage.conversation_id;
              return {
                ...prevChats,
                [conversationId]: [
                  ...(prevChats[conversationId] || []),
                  newMessage,
                ],
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ إرسال رسالة جديدة
  const sendMessage = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to chat with first.");
      return;
    }

    if (!message.trim()) return;

    try {
      const token = userDB?.data?.access_token;
      if (!token) {
        toast.error("You're not logged in. Please login again.");
        return;
      }

      // 📡 إرسال الرسالة للـ API
      const res = await fetch(
        "https://godzilla-be.vercel.app/api/v1/chat/messages/send",
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

      //   if (!res.ok || !result.success) {
      //     throw new Error(result.message || "Failed to send message");
      //   }

      // ✅ نجاح الإرسال
      toast.success("Message sent successfully!");

      const newMessage = {
        id: Date.now(),
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
        created_at: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChats((prevChats) => ({
        ...prevChats,
        [selectedUser.id]: [...(prevChats[selectedUser.id] || []), newMessage],
      }));

      setMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error sending message:", err.message);
      } else {
        console.error("❌ Unknown error:", err);
      }
      toast.error("Failed to send message. Please try again.");
    }
  };
  const { userDB } = useGetUser();
  const currentMessages = selectedUser ? chats[selectedUser.id] || [] : [];
  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar />

      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] pl-[var(--extra-left)]"
      >
        <div className="min-h-screen bg-gray-50 font-sans p-5">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-5 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {selectedUser
                ? `Chat with ${selectedUser.name}`
                : "Select a user to start chatting"}
            </h1>
            <button
              onClick={fetchUsers}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              ↻ Refresh Users
            </button>
          </div>

          <div className="flex gap-5 h-[calc(100vh-140px)]">
            {/* Main Chat */}
            <div className="flex-[2] bg-white rounded-lg shadow-sm flex flex-col">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedUser ? (
                  currentMessages.length > 0 ? (
                    currentMessages.map((msg) => {
                      const isMine = msg.sender_id === userDB?.data?.user_id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex mb-4 ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          {/* الرسالة */}
                          <div
                            className={`flex flex-col max-w-[60%] p-3 rounded-2xl shadow-sm ${
                              isMine
                                ? "bg-pink-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            {/* اسم المرسل + الأفاتار */}
                            <div className="flex items-center gap-2 mb-1">
                              {!isMine && (
                                <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-bold text-xs">
                                  {selectedUser?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </div>
                              )}
                              <span className="font-semibold text-sm">
                                {isMine ? "You" : selectedUser?.name || "User"}
                              </span>
                            </div>

                            {/* محتوى الرسالة */}
                            <p className="text-sm leading-relaxed break-words">
                              {msg.content}
                            </p>

                            {/* التوقيت */}
                            <div
                              className={`text-[10px] mt-2 ${
                                isMine
                                  ? "text-pink-200 text-right"
                                  : "text-gray-500 text-left"
                              }`}
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
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 text-center py-10">
                      No messages yet. Start chatting!
                    </div>
                  )
                ) : (
                  <div className="text-gray-400 text-center py-10">
                    👈 Select a user to start a chat
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedUser && (
                <div className="flex p-5 border-t border-gray-200 gap-3">
                  <input
                    type="text"
                    placeholder={`Message ${selectedUser.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-full text-sm font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-5 h-fit">
              <h3 className="text-gray-800 font-semibold mb-4">Active Users</h3>

              {loadingUsers ? (
                <div className="text-gray-500 text-sm text-center py-4">
                  Loading users...
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm text-center py-4">
                  {error}
                </div>
              ) : (
                <div className="space-y-2 overflow-y-scroll h-96">
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={async () => {
                        try {
                          setLoadingUserId(user.id);
                          setSelectedUser(user);

                          // ✅ 1. بدء المحادثة (أو استرجاعها لو موجودة)
                          const response = await fetch(
                            `https://godzilla-be.vercel.app/api/v1/chat/conversations/start/${user.id}`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${userDB?.data.access_token}`,
                              },
                            }
                          );

                          const result = await response.json();
                          //   if (!response.ok || !result.success)
                          //     throw new Error(
                          //       result.message || "Failed to start conversation"
                          //     );

                          // ✅ حفظ الـ conversation_id في localStorage
                          const conversationId = result.data?.id;
                          if (conversationId) {
                            localStorage.setItem(
                              "conversation_id",
                              conversationId
                            );
                            console.log(
                              "💾 Conversation ID saved:",
                              conversationId
                            );
                          }

                          setConversation(result.data);

                          // ✅ 2. جلب الرسائل الخاصة بالمحادثة دي
                          const messagesRes = await fetch(
                            `https://godzilla-be.vercel.app/api/v1/chat/conversations/${conversationId}/messages`,
                            {
                              headers: {
                                Authorization: `Bearer ${userDB?.data.access_token}`,
                              },
                            }
                          );

                          const messagesData = await messagesRes.json();
                          //   if (!messagesRes.ok || !messagesData.success)
                          //     throw new Error(
                          //       messagesData.message || "Failed to load messages"
                          //     );

                          // ✅ 3. نحفظ الرسائل داخل state حسب المستخدم
                          setChats((prev) => ({
                            ...prev,
                            [user.id]: messagesData.data || [],
                          }));
                        } catch (err: unknown) {
                          if (err instanceof Error) {
                            console.error(
                              "❌ Error sending message:",
                              err.message
                            );
                          } else {
                            console.error("❌ Unknown error:", err);
                          }
                          toast.error(
                            "Failed to send message. Please try again."
                          );
                        } finally {
                          setLoadingUserId(null);
                        }
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-pink-50 border border-pink-300"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {user.avatar}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          {user.name}
                          {loadingUserId === user.id && (
                            <span className="text-xs text-gray-400 animate-pulse">
                              ⏳
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-xs ${
                            user.status === "online"
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {user.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
