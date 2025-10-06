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
  avatar?: File | null;
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  specialization_description?: string;
}

export interface User {
  data: {
    access_token: string;
    email: string;
    expires_at: number;
    refresh_token: string;
    user_id: string;
  };
}
