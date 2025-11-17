import React, { useState } from "react";
import { Heart, Send } from "lucide-react";

// Mock data for demonstration
const mockComments = [
  {
    id: "1",
    userName: "أحمد محمود",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    comment: "Great workout! Keep pushing yourself 💪",
    timestamp: "2 hours ago",
    likes: 5,
  },
  {
    id: "2",
    userName: "سارة أحمد",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    comment: "This is so motivating! Thank you for sharing your journey",
    timestamp: "3 hours ago",
    likes: 8,
  },
  {
    id: "3",
    userName: "محمد علي",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    comment: "What program are you following? I'd love to try it!",
    timestamp: "4 hours ago",
    likes: 2,
  },
  {
    id: "4",
    userName: "فاطمة حسن",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    comment: "Amazing progress! You're such an inspiration 🔥",
    timestamp: "5 hours ago",
    likes: 12,
  },
];

const mockUser = {
  first_name: "يوسف",
  username: "yousef_fit",
  location: "Cairo",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
};

const mockPost = {
  id: "1",
  content:
    "Just completed my 30-day fitness challenge! Feeling stronger than ever 💪",
};

export default function CommentModal() {
  const [openPostId, setOpenPostId] = useState<string>(mockPost.id);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [likedComments, setLikedComments] = useState(new Set());

  const handleTriggerOpenCommentModal = (id: string) => {
    setOpenPostId(id === "0" ? "0" : id);
  };

  const handleAddComment = (e: unknown) => {
    e.preventDefault() as React.FormEvent<HTMLFormElement>;
    if (newComment.trim()) {
      const comment = {
        id: String(comments.length + 1),
        userName: mockUser.first_name,
        userAvatar: mockUser.avatar_url,
        comment: newComment,
        timestamp: "Just now",
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const toggleLike = (commentId: string) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  if (!openPostId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <button
          onClick={() => setOpenPostId(mockPost.id)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full transition"
        >
          Open Comments
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-[10%]">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col "
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 shrink-0">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTriggerOpenCommentModal("0");
            }}
            className="w-9 h-9 rounded-full hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </svg>
          </button>
        </div>

        {/* Comments List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.userAvatar}
                alt={comment.userName}
                className="w-10 h-10 rounded-full shrink-0"
              />
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="font-bold text-sm mb-1">
                    {comment.userName}
                  </div>
                  <p className="text-sm leading-relaxed">{comment.comment}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 px-2">
                  <span className="text-xs text-gray-500">
                    {comment.timestamp}
                  </span>
                  <button
                    onClick={() => toggleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedComments.has(comment.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span
                      className={
                        likedComments.has(comment.id)
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 font-medium transition">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className=" p-4 shrink-0 bg-gray-50">
          <div className="flex gap-3 items-start">
            <img
              src={mockUser.avatar_url}
              alt="Your avatar"
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleAddComment(e);
                  }
                }}
                placeholder="Write a comment..."
                className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-red-500 transition"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
