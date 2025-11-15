// "use client";
// import Sidebar from "@/app/components/shared/sidebar";
// import { Post } from "@/app/types/type";
// import axios from "axios";
// import Image from "next/image";
// import React, { use, useEffect, useState } from "react";

// const Page = ({ params }: { params: Promise<{ id: string }> }) => {
//   const { id } = use(params);
//   const shellVars = {
//     "--sb-w": "88px",
//     "--extra-left": "24px",
//   } as React.CSSProperties;
//   const [post, setPost] = useState<Post | null>(null);

//   useEffect(() => {
//     const fetchGetPostById = async () => {
//       const data = await axios.get(
//         `https://godzilla-be.vercel.app/api/v1/posts/postbyid/${id}`
//       );
//       setPost(data.data.data);
//     };
//     fetchGetPostById();
//   }, [id]);

//   return (
//     <>
//       <div className="min-h-screen bg-[#f7f7f7]">
//         <Sidebar />

//         <main
//           style={shellVars}
//           className="w-full lg:w-[calc(95vw-var(--sb-w)-var(--extra-left))] lg:ml-[calc(var(--sb-w)+var(--extra-left))]"
//         >
//           <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0 py-6 md:py-8">
//             {/* Title + Post button */}
//             <div className="flex items-center justify-between">
//               <h1 className="text-4xl font-bold">Community Post</h1>
//             </div>
//             <div>
//               <h1>{post?.id}</h1>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// export default Page;

"use client";
import { Suspense, use, useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Post } from "@/app/types/type";
import Sidebar from "@/app/components/shared/sidebar";
import { useComments } from "../context/CommentsContext";
import useGetUser from "@/app/Hooks/useGetUser";
import Link from "next/link";

const CommunityPost = ({ params }: { params: Promise<{ id: string }> }) => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { id } = use(params);
  const { userDB } = useGetUser();

  const shellVars = {
    "--sb-w": "88px",
    "--extra-left": "24px",
  } as React.CSSProperties;

  // Mock user data - replace with actual user data

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // Add your comment API call here
      toast.success("تم إضافة التعليق ✅");
      setNewComment("");
    } catch (error) {
      toast.error("فشل في إضافة التعليق ❌");
    }
  };

  console.log(userDB?.data?.user_id);

  useEffect(() => {
    const fetchGetPostById = async () => {
      if (!id || !userDB?.data?.user_id) {
        console.warn("Missing id or user_id, skipping API call");
        setLoading(false); // Stop loading if data is missing
        return;
      }

      setLoading(true); // Set loading true before fetching
      try {
        const response = await axios.get(
          `https://godzilla-be.vercel.app/api/v1/posts/postbyid/${id}/${userDB.data.user_id}`
        );
        setPostData(response.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("فشل في جلب المنشور ❌");
      } finally {
        setLoading(false); // Always stop loading after the request
      }
    };

    fetchGetPostById();
  }, [id, userDB?.data?.user_id]);

  const { addComment } = useComments();

  console.log(postData, "PostDataaaaa");

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
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="flex items-center gap-8 px-4 py-3">
              <button className="hover:bg-gray-100 rounded-full p-2 -ml-2">
                <Link href={"/community"}>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </button>
              <div>
                <h1 className="text-xl font-bold">Community post</h1>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="border-b border-gray-200">
            {/* User Info */}
            <div className="flex items-start justify-between p-4">
              <div className="flex gap-3">
                <img
                  src={postData?.users?.avatar_url}
                  alt={postData?.users?.first_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold hover:underline cursor-pointer">
                      {`${postData?.users?.first_name} ${postData?.users?.second_name}`}
                    </span>

                    <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                      Admin
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{`${postData?.users?.first_name} ${postData?.users?.second_name}`}</p>
                  {/* <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <span>🏆</span>
                    <span>Fan account</span>
                  </div> */}
                </div>
              </div>
              <button className="hover:bg-gray-100 rounded-full p-2">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Text */}
            <div className="px-4 pb-3">
              {/* <button className="text-blue-500 text-sm mb-2 hover:underline flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.8 2c.23 0 .45.08.62.24l4.16 3.74c.23.2.36.5.36.81v10.4c0 .31-.13.61-.36.82l-4.16 3.74c-.17.15-.39.24-.62.24H5.2c-.68 0-1.2-.52-1.2-1.2V3.2C4 2.52 4.52 2 5.2 2h7.6zM8 13v1h4v-1H8zm0-2v1h4v-1H8zm0-2v1h4V9H8z"></path>
                  <path d="M13 7.5h4.5l-1.5-1.5z"></path>
                </svg>
                Translate post
              </button> */}
              <p className="text-xl leading-relaxed" dir="rtl">
                {postData?.bio}
              </p>
              {/* <a className="text-blue-500">#Mohamed Osama</a> */}
            </div>

            {/* Media */}
            {postData?.image && (
              <div className="relative">
                <img
                  src={postData?.image}
                  alt="Post content"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  0:30
                </div>
              </div>
            )}

            {/* Location */}
            {postData?.location && (
              <div className="px-4 py-2 flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{postData?.location}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-around py-3 border-t border-gray-200 px-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-500 rounded-full px-4 py-2 transition-colors group"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-sm">{likeCount || ""}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-500 rounded-full px-4 py-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">
                  {postData?.comment_new.length || ""}
                </span>
              </button>

              <button className="flex items-center gap-2 hover:bg-green-50 hover:text-green-500 rounded-full px-4 py-2 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {postData?.comment_new && (
            <div className="border-b border-gray-200">
              {/* Add Comment */}
              <div className="flex gap-3 p-4 border-b border-gray-200">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => {
                        addComment(
                          postData.id,
                          "sdaasdasd",
                          userDB?.data?.user_id as string
                        );
                        window.location.reload();
                      }}
                      disabled={!newComment.trim()}
                      className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div>
                {postData?.comment_new && postData.comment_new.length > 0 ? (
                  postData.comment_new
                    .filter((comment) => comment.comment) // Filter only valid comments
                    .map((comment, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50"
                      >
                        {/* User Avatar */}
                        <img
                          src={
                            comment?.usersData?.avatar_url ??
                            "https://via.placeholder.com/40"
                          }
                          alt={"User"}
                          className="w-10 h-10 rounded-full"
                        />

                        <div className="flex-1">
                          {/* User Info */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold hover:underline cursor-pointer">
                              {comment?.usersData?.first_name +
                                " " +
                                comment?.usersData?.second_name || "User"}
                            </span>

                            {/* Verified Badge */}
                            {/* {comment.users?.verified && (
                              <svg
                                className="w-5 h-5 text-blue-500"
                                viewBox="0 0 22 22"
                                fill="currentColor"
                              >
                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                              </svg>
                            )} */}

                            {/* Member Badge */}
                            {/* {comment.users?.role === "member" && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                Member
                              </span>
                            )} */}

                            {/* Username */}
                            {/* <span className="text-gray-500 text-sm">
                              @
                              {comment.users?.first_name?.toLowerCase() ||
                                "user"}
                            </span> */}

                            {/* Time */}
                            <span className="text-gray-500 text-sm">
                              •{" "}
                              {new Date(comment.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>

                          {/* Comment Text */}
                          <p className="text-gray-800 mt-1 leading-relaxed">
                            {comment.comment}
                          </p>

                          {/* Comment Actions */}
                          {/* <div className="flex items-center gap-6 mt-3 text-gray-500">
                            <button className="hover:text-red-500 flex items-center gap-1 text-sm transition-colors group">
                              <Heart className="w-4 h-4 group-hover:fill-red-500" />
                              <span>72</span>
                            </button>

                            <button className="hover:text-blue-500 flex items-center gap-1 text-sm transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </button>

                            <button className="hover:text-green-500 flex items-center gap-1 text-sm transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div> */}
                        </div>

                        {/* More Options */}
                        <button className="hover:bg-gray-100 rounded-full p-1 h-8">
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-semibold">No comments yet</p>
                    <p className="text-sm mt-1">
                      Be the first to comment on this post!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityPost;
