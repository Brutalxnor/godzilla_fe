import { SignUpFormData } from "@/app/types/admin";
import axios from "axios";

export const SignUoService = async (data: SignUpFormData) => {
  try {
    const response = await axios.post(

      "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/register",

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
