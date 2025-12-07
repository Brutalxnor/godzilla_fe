import axios from "axios";

export const CreateComment = async (
  postId: string,
  user_id: string,
  comment: string,
  access_token: string
) => {
  try {
    const response = await axios.post(
      "https://tsfq2753gd.execute-api.eu-west-2.amazonaws.com/api/v1/comments",
      {
        post_id: postId,
        user_id,
        text: comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`,
        },
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
