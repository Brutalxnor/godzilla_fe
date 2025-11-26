import axios from "axios";

export const CreateComment = async (
  postId: string,
  user_id: string,
  comment: string
) => {
  try {
    const response = await axios.put(
      "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/posts/update-comment",
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
