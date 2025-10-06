import axios from "axios";

export const GetAllInterests = async () => {
  try {
    const response = await axios.get(
      "https://godzilla-be.vercel.app/api/v1/interests"
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      //   console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { error: "An unexpected error occurred" };
  }
};
