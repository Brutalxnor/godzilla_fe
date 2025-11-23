// components/CommentLikersModal.tsx
import { useState, useEffect } from "react";
import { getCommentLikers } from "../Service/posts.service";

interface User {
  id: string;
  name: string;
  avatar: string;
  user_type?: string;
}

interface CommentLikersModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: string;
}

export default function CommentLikersModal({
  isOpen,
  onClose,
  commentId,
}: CommentLikersModalProps) {
  const [likers, setLikers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && commentId) {
      fetchCommentLikers();
    }
  }, [isOpen, commentId]);

  const fetchCommentLikers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCommentLikers(commentId);
      setLikers(data);
      console.log("data: ", data);
    } catch (err) {
      console.error("Error fetching comment likers:", err);
      setError("Failed to load likers");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Liked by</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96 p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={fetchCommentLikers}
                className="mt-2 text-sm text-rose-500 hover:text-rose-600"
              >
                Try again
              </button>
            </div>
          ) : likers.length > 0 ? (
            <div className="space-y-3">
              {likers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                    {user.user_type && (
                      <div className="text-xs text-gray-500">
                        {user.user_type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No likes yet</p>
              <p className="text-sm mt-1">Be the first to like this comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
