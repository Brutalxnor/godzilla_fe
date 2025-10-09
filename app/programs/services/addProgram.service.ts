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
    equipment_needed: string;
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

// GET all programs for the current user 
export const GetAllPrograms = async () => {
  try {
    const user: User = JSON.parse(localStorage.getItem("user")!);

    if (!user) {
      console.error("User is not found");
    }
    const response = await axios.get(
       `http://127.0.0.1:4000/api/v1/programs/programCoach/${user?.data?.user_id}`
       
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
        "https://godzilla-be.vercel.app/api/v1/programs/add-program",
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
          error: error.response?.data?.message || error.message || "Failed to create program" 
        };
      } else {
        console.error("Unexpected error:", error);
        return { error: "An unexpected error occurred" };
      }
    }
  };
