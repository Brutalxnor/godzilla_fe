import { User } from "@/app/types/admin";
import axios from "axios";
import { headers } from "next/headers";

interface CreatePostType {
  bio: string;
  image: string;
  location: string;
  tags: string[];
  watch: string;
  user_id: string;
}

export const GetAllPosts = async () => {
  try {
    const user: User = await JSON.parse(localStorage.getItem("user")!);

    if (!user) {
      console.error("User is not found");
    }

    const response = await axios.get(
      `https://godzilla-be.vercel.app/api/v1/posts/${user?.data?.user_id}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { error: "An unexpected error occurred" };
  }
};

export const CreatePost = async (data: CreatePostType) => {
  try {
    const response = await axios.post(
      "https://godzilla-be.vercel.app/api/v1/posts/create-post",
      data
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { error: "An unexpected error occurred" };
  }
};
