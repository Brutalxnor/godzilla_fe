// app/auth/services/login.service.ts
import axios, { AxiosError } from "axios";

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



export const LoginService = async (data: LoginData) => {
  try {
    const response = await axios.post<LoginResponse>(
      "https://godzilla-be.vercel.app/api/v1/auth/login",
      data,
      
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const msg =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message;
      return { error: msg || "Login failed" };
    }
    return { error: "An unexpected error occurred" };
  }
};
