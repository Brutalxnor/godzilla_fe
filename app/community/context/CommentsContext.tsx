"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Comment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
};

type CommentsContextType = {
  comments: Comment[];
  fetchComments: (postId: string) => Promise<void>;
  addComment: (
    postId: string,
    content: string,
    author: string
  ) => Promise<void>;
  loading: boolean;
  openPostId: string | null;
  handleTriggerOpenCommentModal: (postId: string) => void;
};

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const fetchComments = async (postId: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://https://godzilla-be.vercel.app/api/v1/posts/df2a3584-aeb4-42e8-8a9b-3b8eeffc51a9`
      );
      setComments(data);
    } catch (error) {
      toast.error("فشل في تحميل التعليقات ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerOpenCommentModal = (postId?: string) => {
    if (postId) {
      setOpenPostId(postId);
    } else {
      setOpenPostId(null);
    }
  };

  const addComment = async (
    postId: string,
    comment: string,
    user_id: string
  ) => {
    try {
      const body = { postId, comment, user_id };
      await axios.put(
        "https://godzilla-be.vercel.app/api/v1/posts/update-comment",
        body
      );
      toast.success("تم إضافة التعليق بنجاح 🎉");
      await fetchComments(postId);
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التعليق ❌");
    }
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        fetchComments,
        addComment,
        loading,
        handleTriggerOpenCommentModal,
        openPostId,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

// ✅ Hook للاستخدام داخل أي كومبوننت
export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};
