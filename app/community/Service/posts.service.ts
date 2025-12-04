/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const BASE_URL = "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1"; // adjust if needed

interface CreatePostType {
  bio: string;
  image: string;
  location: string;
  tags: string[];
  watch: string;
  user_id: string;
}

export async function togglePostLike(postId: string, userId: string) {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const res = await axios.post(
    `${BASE_URL}/posts/like`,
    { postId, user_id: userId },
    {
      headers: user
        ? {
            Authorization: `Bearer ${user?.data?.access_token}`,
          }
        : {},
    }
  );

  return res.data as {
    success: boolean;
    message: string;
    liked: boolean;
    likesCount: number;
    liked_by: string[];
  };
}

export async function SharePostToUser(postId: string, receiver_id: string) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await fetch(`https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/posts/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.data?.access_token}`,
    },
    body: JSON.stringify({
      postId,
      sender_id: user.data.user_id,
      receiver_id,
    }),
  });

  return res.json();
}

export const UpdatePost = async (postId: string, postData: CreatePostType) => {
  try {
    const response = await fetch(
      `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/posts/${postId}`,
      {
        method: "Patch",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update post");
    }

    return result;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

interface CreateCommentType {
  post_id: string;
  text: string;
  parent_comment_id?: string | null;
  access_token: string;
}

export async function createComment(commentData: CreateCommentType) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await axios.post(`${BASE_URL}/comments`, commentData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${commentData.access_token}`,
    },
  });

  return res.data as {
    success: boolean;
    message: string;
    data: any;
  };
}

export async function toggleCommentLike(commentId: string) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await axios.post(
    `${BASE_URL}/comments/${commentId}/toggle-like`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.data?.access_token}`,
      },
    }
  );

  return res.data as {
    success: boolean;
    message: string;
    liked: boolean;
    likesCount: number;
    liked_by: string[];
  };
}

export const getCommentLikers = async (commentId: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  try {
    const response = await fetch(
      `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/comments/${commentId}/likers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.data?.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comment likers");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching comment likers:", error);
    throw error;
  }
};
