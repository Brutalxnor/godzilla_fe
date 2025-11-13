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
  comment_new: {
    comment: string;
    user_id: string;
    created_at: string;
    usersData: {
      avatar_url: "https://uivcyyfyefpkieynavgw.supabase.co/storage/v1/object/public/avatars/7dde76e1-6a6d-466b-b391-8036ac60ee98/7dde76e1-6a6d-466b-b391-8036ac60ee98-1763037295776.jpg";
      bio: null;
      created_at: "2025-10-07T12:08:22.542654+00:00";
      date_of_birth: "2025-09-27";
      email: "rawan1@gmail.com";
      email_verified: false;
      experience_level: "intermediate";
      first_name: "rawans";
      id: "7dde76e1-6a6d-466b-b391-8036ac60ee98";
      is_active: true;
      last_login: null;
      location: "maadi";
      phone: "01122932666";
      second_name: "mohamed";
      status: "online";
      timestamp: "2025-11-13T14:25:26.222+00:00";
      updated_at: "2025-11-13T14:25:26.303391+00:00";
      user_type: "athlete";
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
