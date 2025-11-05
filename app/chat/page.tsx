// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import Sidebar from "../components/shared/sidebar";
// import useGetUser from "../Hooks/useGetUser";
// import { toast } from "react-toastify";
// import { supabase } from "@/lib/client";
// import { RealtimeChannel } from "@supabase/supabase-js";
// import useGetTheme from "../Hooks/useGetTheme";

// type ChatMessage = {
//   id: number | string;
//   user: string;
//   avatar: string;
//   time: string;
//   content: string;
//   sender_id: string;
//   likes: number;
//   replies: number;
//   created_at: string;
//   conversation_id?: string;
// };

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [selectedUser, setSelectedUser] = useState<{
//     id: string;
//     name: string;
//     status: string;
//     avatar: string;
//   } | null>(null);
//   const [chats, setChats] = useState<{ [key: string]: ChatMessage[] }>({});
//   const [activeUsers, setActiveUsers] = useState<
//     { id: string; name: string; status: string; avatar: string }[]
//   >([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [error, setError] = useState("");
//   const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);
//   const [showUserList, setShowUserList] = useState(false);

//   const { userDB } = useGetUser();
//   const channelRef = useRef<RealtimeChannel | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       setError("");

//       const res = await fetch(
//         "https://godzilla-be.vercel.app/api/v1/auth/getusers"
//       );
//       if (!res.ok) throw new Error("Failed to fetch users");

//       const result = await res.json();
//       if (!result || !result.data) throw new Error("Invalid response format");

//       const formattedUsers = result.data.map(
//         (user: { id: string; first_name: string; status: string }) => ({
//           id: user.id,
//           name: user.first_name || "Unknown",
//           status: user.status || "online",
//           avatar:
//             user.first_name
//               ?.split(" ")
//               .map((n: string) => n[0])
//               .join("") || "U",
//         })
//       );

//       setActiveUsers(formattedUsers);
//     } catch (err: unknown) {
//       console.error("Error fetching users:", err);
//       setError("Failed to load users");
//       toast.error("Failed to load users");
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     if (!conversationId) return;

//     console.log(
//       "🔌 Subscribing to broadcast for conversation:",
//       conversationId
//     );

//     if (channelRef.current) {
//       console.log("🧹 Removing old channel");
//       supabase.removeChannel(channelRef.current);
//     }

//     const channel = supabase
//       .channel(`chat-${conversationId}`)
//       .on("broadcast", { event: "new-message" }, (payload) => {
//         console.log("🆕 Broadcast message received:", payload);

//         const newMessage = payload.payload as ChatMessage;

//         if (newMessage.sender_id === userDB?.data?.user_id) {
//           console.log("⚠️ Skipping own message");
//           return;
//         }

//         setChats((prevChats) => {
//           const currentChat = prevChats[selectedUser?.id || ""] || [];

//           const exists = currentChat.some((msg) => msg.id === newMessage.id);
//           if (exists) {
//             console.log("⚠️ Message already exists");
//             return prevChats;
//           }

//           return {
//             ...prevChats,
//             [selectedUser?.id || ""]: [...currentChat, newMessage],
//           };
//         });

//         toast.success("New message received!");
//       })
//       .subscribe((status) => {
//         console.log("📡 Channel status:", status);
//       });

//     channelRef.current = channel;

//     return () => {
//       console.log("🧹 Unsubscribing from:", conversationId);
//       if (channelRef.current) {
//         supabase.removeChannel(channelRef.current);
//         channelRef.current = null;
//       }
//     };
//   }, [conversationId, selectedUser?.id, userDB?.data?.user_id]);

//   const sendMessage = async () => {
//     if (!selectedUser) {
//       toast.error("Please select a user to chat with first.");
//       return;
//     }

//     if (!message.trim()) return;

//     try {
//       const token = userDB?.data?.access_token;
//       if (!token) {
//         toast.error("You're not logged in. Please login again.");
//         return;
//       }

//       const res = await fetch(
//         "https://godzilla-be.vercel.app/api/v1/chat/messages/send",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             recipient_id: selectedUser.id,
//             content: message,
//           }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message || "Failed to send message");
//       }

//       const newMessage: ChatMessage = {
//         id: result.data?.message?.id || Date.now(),
//         user: "You",
//         avatar: "ME",
//         time: new Date().toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         content: message,
//         sender_id: userDB?.data?.user_id,
//         likes: 0,
//         replies: 0,
//         created_at: new Date().toISOString(),
//         conversation_id: conversationId || undefined,
//       };

//       setChats((prevChats) => ({
//         ...prevChats,
//         [selectedUser.id]: [...(prevChats[selectedUser.id] || []), newMessage],
//       }));

//       if (conversationId) {
//         await supabase.channel(`chat-${conversationId}`).send({
//           type: "broadcast",
//           event: "new-message",
//           payload: newMessage,
//         });
//       }

//       setMessage("");
//       toast.success("Message sent!");
//     } catch (err: unknown) {
//       console.error("Error sending message:", err);
//       toast.error("Failed to send message. Please try again.");
//     }
//   };

//   const selectUser = async (user: (typeof activeUsers)[0]) => {
//     try {
//       setLoadingUserId(user.id);
//       setSelectedUser(user);
//       setShowUserList(false); // Close user list on mobile after selection

//       const response = await fetch(
//         `https://godzilla-be.vercel.app/api/v1/chat/conversations/start/${user.id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userDB?.data.access_token}`,
//           },
//         }
//       );

//       const result = await response.json();
//       const convId = result.data?.id;

//       if (!convId) {
//         throw new Error("No conversation ID returned");
//       }

//       setConversationId(convId);
//       localStorage.setItem("conversation_id", convId);
//       console.log("💾 Conversation ID saved:", convId);

//       const messagesRes = await fetch(
//         `https://godzilla-be.vercel.app/api/v1/chat/conversations/${convId}/messages`,
//         {
//           headers: {
//             Authorization: `Bearer ${userDB?.data.access_token}`,
//           },
//         }
//       );

//       const messagesData = await messagesRes.json();

//       setChats((prev) => ({
//         ...prev,
//         [user.id]: messagesData.data || [],
//       }));
//     } catch (err: unknown) {
//       console.error("Error selecting user:", err);
//       toast.error("Failed to load conversation");
//     } finally {
//       setLoadingUserId(null);
//     }
//   };

//   const currentMessages = selectedUser ? chats[selectedUser.id] || [] : [];
//   const shellVars = {
//     "--sb-w": "88px",
//     "--extra-left": "24px",
//   } as React.CSSProperties;
//   const {theme} = useGetTheme()
//   return (
//     <div className={`min-h-screen ${theme === "dark" ? "bg-black": "bg-white"}`}>
//       <Sidebar />

//       <main
//         style={shellVars}
//         className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] px-3 sm:px-4 lg:pl-[var(--extra-left)]"
//       >
//         <div className="min-h-screen font-sans py-3 sm:py-5">
//           {/* Header */}
//           <div className={`rounded-lg ${theme == "dark" ? "bg-[#0f0f10] border-2 border-gray-400 text-white": "bg-white"} shadow-sm p-3 sm:p-4 mb-3 sm:mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}>
//             <div className="flex items-center gap-2 flex-1">
//               {/* Mobile: Back button when user is selected */}
//               {selectedUser && (
//                 <button
//                   onClick={() => setSelectedUser(null)}
//                   className="lg:hidden text-gray-600 hover:text-gray-800 p-2 -ml-2"
//                   aria-label="Back to users"
//                 >
//                   ←
//                 </button>
//               )}
//               <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate">
//                 {selectedUser
//                   ? `Chat with ${selectedUser.name}`
//                   : "Select a user to start chatting"}
//               </h1>
//             </div>

//             <div className="flex gap-2 w-full sm:w-auto">
//               {/* Mobile: Toggle user list */}
//               <button
//                 onClick={() => setShowUserList(!showUserList)}
//                 className="lg:hidden flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
//               >
//                 {showUserList ? "Hide Users" : "👥 Users"}
//               </button>

//               <button
//                 onClick={fetchUsers}
//                 className="flex-1 sm:flex-none bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
//               >
//                 ↻ Refresh
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex gap-3 sm:gap-5 h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] relative">
//             {/* Chat Area */}
//             <div
//               className={`${
//                 selectedUser ? "flex" : "hidden lg:flex"
//               } flex-col rounded-lg shadow-sm w-full lg:flex-[2]`}
//             >
//               <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
//                 {selectedUser ? (
//                   currentMessages.length > 0 ? (
//                     currentMessages.map((msg) => {
//                       const isMine = msg.sender_id === userDB?.data?.user_id;

//                       return (
//                         <div
//                           key={msg.id}
//                           className={`flex mb-3 sm:mb-4 ${
//                             isMine ? "justify-end" : "justify-start"
//                           }`}
//                         >
//                           <div
//                             className={`flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] p-2.5 sm:p-3 rounded-2xl shadow-sm ${
//                               isMine
//                                 ? "bg-pink-500 text-white rounded-br-none"
//                                 : "bg-gray-100 text-gray-800 rounded-bl-none"
//                             }`}
//                           >
//                             <div className="flex items-center gap-2 mb-1">
//                               {!isMine && (
//                                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-bold text-xs">
//                                   {selectedUser?.name
//                                     ?.charAt(0)
//                                     ?.toUpperCase() || "U"}
//                                 </div>
//                               )}
//                               <span className="font-semibold text-xs sm:text-sm">
//                                 {isMine ? "You" : selectedUser?.name || "User"}
//                               </span>
//                             </div>

//                             <p className="text-xs sm:text-sm leading-relaxed break-words">
//                               {msg.content}
//                             </p>

//                             <div
//                               className={`text-[9px] sm:text-[10px] mt-1.5 sm:mt-2 ${
//                                 isMine
//                                   ? "text-pink-200 text-right"
//                                   : "text-gray-500 text-left"
//                               }`}
//                             >
//                               {msg.created_at
//                                 ? new Date(msg.created_at).toLocaleTimeString(
//                                     "en-US",
//                                     {
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                     }
//                                   )
//                                 : msg.time || ""}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="text-gray-500 text-center py-10 text-sm">
//                       No messages yet. Start chatting!
//                     </div>
//                   )
//                 ) : (
//                   <div className="text-gray-400 text-center py-10 text-sm">
//                     👈 Select a user to start a chat
//                   </div>
//                 )}
//               </div>

//               {/* Message Input */}
//               {selectedUser && (
//                 <div className="flex p-3 sm:p-5 border-t border-gray-200 gap-2 sm:gap-3">
//                   <input
//                     type="text"
//                     placeholder={`Message ${selectedUser.name}...`}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-full text-xs sm:text-sm outline-none focus:border-pink-500 transition-colors"
//                   />
//                   <button
//                     onClick={sendMessage}
//                     className="bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
//                   >
//                     Send
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* User List - Desktop always visible, Mobile as overlay/toggle */}
//             <div
//               className={`
//                 ${showUserList ? "flex" : "hidden"}
//                 lg:flex flex-col bg-white rounded-lg shadow-sm p-4 sm:p-5
//                 absolute lg:relative inset-0 lg:inset-auto z-10 lg:z-0
//                 lg:flex-1 lg:h-fit
//               `}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-gray-800 font-semibold text-sm sm:text-base">
//                   Active Users
//                 </h3>
//                 <button
//                   onClick={() => setShowUserList(false)}
//                   className="lg:hidden text-gray-500 hover:text-gray-700 text-xl"
//                   aria-label="Close user list"
//                 >
//                   ×
//                 </button>
//               </div>

//               {loadingUsers ? (
//                 <div className="text-gray-500 text-xs sm:text-sm text-center py-4">
//                   Loading users...
//                 </div>
//               ) : error ? (
//                 <div className="text-red-500 text-xs sm:text-sm text-center py-4">
//                   {error}
//                 </div>
//               ) : (
//                 <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-96">
//                   {activeUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       onClick={() => selectUser(user)}
//                       className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-lg cursor-pointer transition-colors ${
//                         selectedUser?.id === user.id
//                           ? "bg-pink-50 border border-pink-300"
//                           : "hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
//                         {user.avatar}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="text-xs sm:text-sm font-medium text-gray-800 flex items-center gap-2 truncate">
//                           {user.name}
//                           {loadingUserId === user.id && (
//                             <span className="text-xs text-gray-400 animate-pulse">
//                               ⏳
//                             </span>
//                           )}
//                         </div>
//                         <div
//                           className={`text-[10px] sm:text-xs ${
//                             user.status === "online"
//                               ? "text-green-500"
//                               : "text-gray-400"
//                           }`}
//                         >
//                           {user.status}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Chat;

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

/* Small helpers */
const OnlineDot = ({ online }: { online: boolean }) => (
  <span
    className={[
      "inline-block h-2.5 w-2.5 rounded-full",
      online ? "bg-green-500" : "bg-zinc-400",
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
  const [showUserList, setShowUserList] = useState(false);

  const { userDB } = useGetUser();
  const { theme } = useGetTheme();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentMessages = selectedUser ? chats[selectedUser.id] || [] : [];

  /* layout vars for your sidebar */
  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  /* =========================
     Load users
     ========================= */
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
        .map((user: { id: string; first_name: string; status: string }) => ({
          id: user.id,
          name: user.first_name || "Unknown",
          status: user.status || "online",
          avatar:
            user.first_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("") || "U",
        }))
        .filter(
          (user: { id: string; first_name: string; status: string }) =>
            user.id !== userDB?.data?.user_id
        );
      console.log(formattedUsers);
      formattedUsers.filter((user) => user.id !== userDB?.data?.user_id);
      console.log(userDB?.data?.user_id);
      console.log(formattedUsers);

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
  }, [conversationId, selectedUser?.id, userDB?.data?.user_id]);

  /* =========================
     Select a user / load conversation
     ========================= */
  const selectUser = async (user: LiteUser) => {
    try {
      setLoadingUserId(user.id);
      setSelectedUser(user);
      setShowUserList(false);

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
      const convId = result?.data?.id;
      if (!convId) throw new Error("No conversation ID");

      setConversationId(convId);
      localStorage.setItem("conversation_id", convId);

      const messagesRes = await fetch(
        `https://godzilla-be.vercel.app/api/v1/chat/conversations/${convId}/messages`,
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
     Render
     ========================= */
  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
        <Sidebar />
      </Suspense>

      <main
        style={shellVars}
        className="w-full lg:w-[calc(100vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))] px-4"
      >
        {/* Top bar */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-semibold">Messages</h1>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-4 lg:gap-5 pb-24">
          {/* ============ User list ============ */}
          <section
            className={[
              "relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm",
              "lg:static",
              showUserList ? "block" : "hidden lg:block",
            ].join(" ")}
          >
            {/* Mobile header */}
            <div className="mb-3 flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setShowUserList(false)}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <span className="text-sm text-zinc-500">Active users</span>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-rose-500"
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

            {/* List */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-240px)]">
              {loadingUsers ? (
                <>
                  <Skeleton className="h-[58px]" />
                  <Skeleton className="h-[58px]" />
                  <Skeleton className="h-[58px]" />
                </>
              ) : error ? (
                <div className="text-sm text-red-500 text-center py-6">
                  {error}
                </div>
              ) : activeUsers.length === 0 ? (
                <div className="text-sm text-zinc-500 text-center py-6">
                  No users
                </div>
              ) : (
                activeUsers.map((user) => {
                  const active = selectedUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className={[
                        "w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                        active
                          ? "border-rose-300 bg-rose-50/60"
                          : "border-zinc-200 hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-500 text-white font-semibold">
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{user.name}</p>
                          {loadingUserId === user.id && (
                            <span className="text-xs text-zinc-400 animate-pulse">
                              ⏳
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                          <OnlineDot online={user.status === "online"} />
                          <span>{user.status}</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* ============ Conversation ============ */}
          <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col min-h-[60vh]">
            {/* Sticky conversation header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 p-3 sm:p-4 bg-white">
              {/* Mobile user-list toggle */}
              <button
                onClick={() => setShowUserList(true)}
                className="lg:hidden inline-flex items-center rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm hover:bg-zinc-50"
                aria-label="Open users"
              >
                Users
              </button>

              {selectedUser ? (
                <>
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white font-semibold">
                    {selectedUser.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {selectedUser.name}
                      </h3>
                      <Circle
                        className={[
                          "h-2.5 w-2.5",
                          selectedUser.status === "online"
                            ? "text-green-500"
                            : "text-zinc-400",
                        ].join(" ")}
                        fill="currentColor"
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      {selectedUser.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-500">
                  Select a user to start chatting
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
              {!selectedUser ? (
                <div className="text-zinc-400 text-center py-10 text-sm">
                  👈 Choose someone from the list to begin
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="text-zinc-500 text-center py-10 text-sm">
                  No messages yet. Say hi!
                </div>
              ) : (
                currentMessages.map((msg) => {
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
                          "max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-3 py-2.5 shadow-sm",
                          mine
                            ? "bg-rose-500 text-white rounded-br-none"
                            : "bg-zinc-100 text-zinc-900 rounded-bl-none",
                        ].join(" ")}
                      >
                        {!mine && (
                          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-zinc-700">
                            {selectedUser?.name}
                          </div>
                        )}
                        <p className="text-sm leading-relaxed break-words">
                          {msg.content}
                        </p>
                        <div
                          className={[
                            "mt-1.5 text-[10px]",
                            mine ? "text-rose-100 text-right" : "text-zinc-500",
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
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Composer */}
            {selectedUser && (
              <div className="border-t border-zinc-200 p-3 sm:p-4">
                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-2">
                  <button
                    className="p-2 rounded-full hover:bg-zinc-50"
                    aria-label="Attach"
                  >
                    <Paperclip className="h-5 w-5 text-zinc-500" />
                  </button>
                  <input
                    className="flex-1 bg-transparent px-1 text-sm outline-none"
                    placeholder={`Message ${selectedUser.name}…`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    className="p-2 rounded-full hover:bg-zinc-50"
                    aria-label="Emoji"
                  >
                    <Smile className="h-5 w-5 text-zinc-500" />
                  </button>
                  <button
                    onClick={sendMessage}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Chat;
