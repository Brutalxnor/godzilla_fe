

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


export async function SharePostToUser(postId: string, receiver_id: string) {

    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    const res = await fetch(`https://godzilla-be.vercel.app/api/v1/posts/share`, {
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
  
