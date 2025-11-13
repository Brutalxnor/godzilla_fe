

import axios from "axios";

const BASE_URL = "https://godzilla-be.vercel.app/api/v1"; // adjust if needed

export async function togglePostLike(postId: string, userId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await axios.post(
    `${BASE_URL}/posts/like`,
    { postId, user_id: userId },
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
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
