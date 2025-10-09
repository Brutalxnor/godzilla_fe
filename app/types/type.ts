export interface InterestType {
  id: string;
  name: string;
  category: string;
}

export interface User {
  id: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  is_active: boolean;
  user_type: "Coach" | "Athlete";
  avatar_url: string;
  created_at: string;
  first_name: string;
  last_login: string;
  updated_at: string;
  second_name: string;
  date_of_birth: string;
  email_verified: boolean;
  experience_level: string;
}

export interface Post {
  id: string;
  bio: string;
  created_at: string;
  image: string;
  location: string;
  tags: string[];
  user_id: string;
  users: User;
  watch: "public" | "friends";
}

export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount_percentage: number;
  cover_image_url: string;
  category: string;
  difficulty_level: string;
  duration_weeks: number;
  sessions_per_week: number;
  total_videos: number;
  total_pdfs: number;
  is_published: boolean;
  published_at: string | null;
  coach_id: string;
  users: {
    id: string;
    avatar_url: string | null;
    first_name: string;
    second_name: string;
  };
};
