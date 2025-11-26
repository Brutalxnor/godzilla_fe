import axios from "axios";
import { User } from "@/app/types/admin";

export interface CreateProgramType {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty_level: "beginner" | "intermediate" | "advanced"; // lowercase to match
  duration_weeks: number; // fixed the typo (was duration_Weeks)
  sessions_per_week: number;
  minutes_per_session: number;
  price: number;
  discount_percentage?: number;
  equipment_needed: string[];
  space_required: string;
  target_audience: string;
  prerequisites: string;
  expected_results: string;
  includes_meal_plan: boolean;
  includes_supplement_guide: boolean;
  includes_progress_tracking: boolean;
  includes_chat_support: boolean;
  cover_image_url?: string;
  videos?: string;
  thumbnails?: string;
  pdfs?: string;
  user_id: string;
}

export type ProgramFromAPI = {
  users: boolean;
  description: string;
  cover_image_url: string;
  id: string | number;
  title: string;
  subscribers?: number;
  rating?: number;
};

// GET all programs for the current user
export const GetAllPrograms = async () => {
  try {
    const user: User = JSON.parse(localStorage.getItem("user")!);

    if (!user) {
      console.error("User is not found");
    }
    const response = await axios.get(
      `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs`
    );

    return response.data?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { error: "An unexpected error occurred" };
  }
};
interface StoredUser {
  data?: {
    access_token?: string;
    user_id?: string;
  };
}

export const CreateProgram = async (data: CreateProgramType) => {
  try {
    const userString = localStorage.getItem("user");

    // Return early if no user is logged in
    if (!userString) {
      return { error: "User not authenticated" };
    }

    // Parse the user data
    const user: StoredUser = JSON.parse(userString);

    // Check if we have an access token
    const accessToken = user?.data?.access_token;
    if (!accessToken) {
      return { error: "No access token found" };
    }

    const response = await axios.post(
      "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/add-program",
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create program",
      };
    } else {
      console.error("Unexpected error:", error);
      return { error: "An unexpected error occurred" };
    }
  }
};

export const GetProgramsByCoachId = async (
  coachId: string | number
): Promise<ProgramFromAPI[]> => {
  try {
    const userString = localStorage.getItem("user");
    let accessToken: string | undefined;

    if (userString) {
      const user: StoredUser = JSON.parse(userString);
      accessToken = user?.data?.access_token;
    }

    const response = await axios.get(
      `https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/programs/programCoach/${coachId}`,
      accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined
    );

    const raw = response.data?.data;
    return Array.isArray(raw) ? (raw as ProgramFromAPI[]) : [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error (GetProgramsByCoachId):",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error (GetProgramsByCoachId):", error);
    }
    return [];
  }
};
