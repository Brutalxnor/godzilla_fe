import axios from "axios";
import { Trainer } from "../trainers/TrainerCard";
// 👈 same Trainer type you already use in the page

const BASE_URL = "https://godzilla-be.vercel.app/api/v1/coaches";
// adjust if your backend route is different

// === Raw shape from your backend (coach_profiles joined with users) ===
export interface ApiCoach {
  id: number; // coach_profiles row id
  user_id: string; // FK to users table

  // fields from coach_profiles (adjust names if different in DB)
  rating?: number | null;
  reviews_count?: number | null;
  monthly_price?: number | null;
  verified?: boolean | null;
  tags?: string[] | null;
  programs_count?: number | null;
  cover_url?: string | null;

  // joined user from:
  // user: users!coach_profiles_user_id_fkey(...)
  user: {
    id: string;
    first_name: string;
    second_name: string;
    email: string;
    avatar_url?: string | null;
    experience_level?: string | null;
    location?: string | null;
    bio?: string | null;
  };
}

// === Mapper: API → TrainerCard's Trainer type ===
function mapCoachToTrainer(coach: ApiCoach): Trainer {
  const fullName =
    `${coach.user?.first_name ?? ""} ${coach.user?.second_name ?? ""}`.trim() ||
    "Coach";

  return {
    id: coach.user?.id ?? coach.user_id ?? coach.id,
    first_name: coach.user?.first_name ?? "",
    second_name: coach.user?.second_name ?? "",
    user_type: "coach",
    location: coach.user?.location ?? "Unknown location",
    rating: coach.rating ?? 0,
    reviews_count: coach.reviews_count ?? 0,
    monthly_price: coach.monthly_price ?? 0,
    verified: Boolean(coach.verified),
    tags: coach.tags ?? [],
    bio: coach.user?.bio ?? "",
    programs_count: coach.programs_count ?? 0,
    cover_url:
      coach.cover_url ??
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    avatar_url:
      coach.user?.avatar_url ??
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName),
  };
}

// 🔹 GET /api/v1/coaches  → all coaches
export async function getAllCoaches(id: string): Promise<Trainer[]> {
  try {
    const res = await axios.get(`BASE_URL/${id}`);
    const data = (res.data?.data ?? []) as ApiCoach[];
    return data.map(mapCoachToTrainer);
  } catch (err) {
    console.error("Error fetching coaches:", err);
    throw err;
  }
}

// 🔹 GET /api/v1/coaches/profile/:user_id → single coach profile
export async function getCoachProfileByUserId(
  userId: string
): Promise<Trainer | null> {
  try {
    const res = await axios.get(`${BASE_URL}/profile/${userId}`);
    const coach = (res.data?.data ?? null) as ApiCoach | null;
    if (!coach) return null;
    return mapCoachToTrainer(coach);
  } catch (err) {
    console.error("Error fetching coach profile:", err);
    throw err;
  }
}
