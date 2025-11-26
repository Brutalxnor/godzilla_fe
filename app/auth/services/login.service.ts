// app/auth/services/login.service.ts
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    role: "athlete" | "coach";
  };
  [key: string]: unknown;
}

export const LoginService = async (
  data: LoginData
): Promise<LoginResponse | { error: string }> => {
  try {
    const response = await axios.post<LoginResponse>(
      "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/auth/login",
      data
    );

    // احفظ في localStorage (ده OK، بس ممكن تنقله للـ component لو عايز)
    localStorage.setItem("user", JSON.stringify(response.data));

    return response.data; // رجّع الـ data بس
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const msg =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message;
      return { error: msg || "Login failed" }; // رجّع error كـ object
    }
    return { error: "An unexpected error occurred" };
  }
};
