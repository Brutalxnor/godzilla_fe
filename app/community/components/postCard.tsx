// // components/shared/PostCard.tsx
// import Image from "next/image";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { CreateComment } from "../Service/CreateComment";
// import { useComments } from "../context/CommentsContext";
// import { Post } from "@/app/types/type";
// import useGetUser from "@/app/Hooks/useGetUser";

// export type PostCardProps = {
//   author: { name: string; role?: "Coach" | "Athlete"; avatar?: string };
//   timeAgo: string;
//   content: string;
//   image?: string;
//   stats?: { likes: number; comments: number; shares: number };
//   post: Post;
// };

// export default function PostCard({
//   author,
//   timeAgo,
//   content,
//   image,
//   post,
//   stats = { likes: 0, comments: 0, shares: 0 },
// }: PostCardProps) {
//   const { openPostId, addComment, handleTriggerOpenCommentModal } =
//     useComments();
//   const { userDB } = useGetUser();
//   return (
//     <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           {author.avatar ? (
//             <img
//               src={author.avatar || "https://example.com/images/sunset.jpg"}
//               alt={author.name || "https://example.com/images/sunset.jpg"}
//               width={40}
//               height={40}
//               className="rounded-full"
//             />
//           ) : (
//             <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-xs font-semibold text-gray-700">
//               {author.name
//                 .split(" ")
//                 .map((p) => p[0])
//                 .join("")
//                 .slice(0, 2)
//                 .toUpperCase()}
//             </div>
//           )}

//           <div>
//             <div className="flex items-center gap-2">
//               <span className="font-medium text-sm sm:text-[15px]">
//                 {author.name}
//               </span>
//               {author.role && (
//                 <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
//                   {author.role}
//                 </span>
//               )}
//               <span className="text-[11px] text-rose-500">↗</span>
//             </div>
//             <div className="text-xs text-gray-500">{timeAgo}</div>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="text-gray-400 hover:text-gray-600"
//           aria-label="More"
//         >
//           •••
//         </button>
//       </div>

//       {/* Body */}
//       <div className="mt-3 text-sm text-gray-800 whitespace-pre-line">
//         {content}
//       </div>

//       {image && (
//         <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
//           <img
//             src={image || "https://example.com/images/sunset.jpg"}
//             alt={"post image"}
//             width={1200}
//             height={800}
//             className="w-full h-64 sm:h-72 object-cover"
//           />
//         </div>
//       )}

//       {/* Footer stats */}
//       <div className="mt-3 flex items-center gap-6 text-gray-500">
//         <button className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors">
//           <span>❤️</span>
//           <span className="text-sm">{stats.likes}</span>
//         </button>
//         <button
//           onClick={handleTriggerOpenCommentMoal}
//           className="inline-flex cursor-pointer items-center gap-1.5 hover:text-gray-700 transition-colors"
//         >
//           <span>💬</span>
//           <span className="text-sm">{stats.comments}</span>
//         </button>
//         <button className="inline-flex items-center gap-1.5 hover:text-gray-700 transition-colors">
//           <span>↗</span>
//           <span className="text-sm">{stats.shares}</span>
//         </button>
//       </div>

//       {/*Comment Modal*/}

//       {isOpenCommentModal && (
//         <div className="fixed inset-0 bg-black/1 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b">
//               <button
//                 onClick={handleTriggerOpenCommentMoal}
//                 className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
//                 </svg>
//               </button>

//               <button className="text-blue-500 text-sm font-medium hover:underline">
//                 Drafts
//               </button>
//             </div>

//             {/* Content */}
//             <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
//               {/* Original Post */}
//               <div className="p-4 flex gap-3">
//                 <img
//                   src="https://via.placeholder.com/40"
//                   alt="User"
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div className="flex-1">
//                   <div className="flex items-center gap-1 mb-1">
//                     <span className="font-bold text-sm">GoogleArabia</span>
//                     <svg
//                       className="w-4 h-4 text-yellow-500"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M8.5 12.5l2 2 5-5" />
//                     </svg>
//                     <span className="text-gray-500 text-sm">
//                       @GoogleArabia · Sep 9
//                     </span>
//                   </div>
//                   <p className="text-sm text-right leading-relaxed">
//                     نسخة Pro من Google Gemini متاحة الآن مجاناً لمدة سنة لطلاب
//                     الجامعات في مصر والمملكة العربية السعودية
//                   </p>
//                 </div>
//               </div>

//               {/* Reply Section */}
//               <div className="px-4 pb-4">
//                 <div className="flex gap-3">
//                   <div className="w-10 flex flex-col items-center">
//                     <div className="w-0.5 h-full bg-gray-300"></div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <img
//                     src="https://via.placeholder.com/40"
//                     alt="Your profile"
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div className="flex-1">
//                     <textarea
//                       placeholder="Post your reply"
//                       className="w-full min-h-[100px] text-lg outline-none resize-none"
//                       autoFocus
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="border-t p-4">
//               <div className="flex items-center justify-end">
//                 <button
//                   onClick={() =>
//                     // addComment(
//                     //   post.id,
//                     //   "sssssss",
//                     //   userDB?.data?.user_id as string
//                     // )
//                     {
//                       console.log(post);
//                     }
//                   }
//                   className="bg-blue-500  hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full transition"
//                 >
//                   Reply
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </article>
//   );
// }
