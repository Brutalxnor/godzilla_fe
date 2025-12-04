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
      `https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/feed`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.data?.access_token}`,
        },
      }
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
   const user: User = await JSON.parse(localStorage.getItem("user")!);
  try {
    const response = await axios.post(
      "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/posts/create-post",
      data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.data?.access_token}`,
        },
      }
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
