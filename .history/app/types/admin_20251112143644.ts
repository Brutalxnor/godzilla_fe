export interface SignUpFormData {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  user_type: "athlete" | "coach";
  location: string;
  phone: string;
  date_of_birth: string;
  interests: string[];
  avatar?: string | null;
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  specialization_description?: string;
  avatar_url?: File | string | null;
}

export interface User {
  data: {
    access_token: string;
    email: string;
    expires_at: number;
    refresh_token: string;
    user_id: string;
    user: {
      date_of_birth: string;
      experience_level: string;
      first_name: string;
      last_login: string;
      location: string;
      phone: string;
      a
      second_name: string;
      user_type: string;
      message: string;
    };
  };
}
