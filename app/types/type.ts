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
