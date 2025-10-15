import axios from "axios";

export const CreateComment = async (
  postId: string,
  user_id: string,
  comment: string
) => {
  try {
    const response = await axios.put(
      "https://godzilla-be.vercel.app/api/v1/posts/update-comment",
      {
        postId,
        user_id,
        comment,
      }
    );

    console.log("✅ Comment added successfully:", response.data);
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
