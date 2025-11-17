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
  username: string;
}

export interface Post {
  id: string;
  bio: string;
  created_at: string;
  image: string;
  location: string;
  tags: string[];
  liked_by?: string[];
  share_count: number;
  user_id: string;
  users: User;
  watch: "public" | "friends";
  comment_new: {
    comment: string;
    user_id: string;
    created_at: string;
    usersData: {
      avatar_url: string;
      bio: boolean;
      created_at: string;
      date_of_birth: string;
      email: string;
      email_verified: boolean;
      experience_level: string;
      first_name: string;
      id: string;
      is_active: boolean;
      last_login: boolean;
      location: string;
      phone: string;
      second_name: string;
      status: string;
      timestamp: string;
      updated_at: string;
      user_type: string;
    };
  }[];
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
