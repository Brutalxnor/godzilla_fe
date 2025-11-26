import axios from "axios";

const BASE_URL = "https://gdv8tql1h2.execute-api.eu-west-2.amazonaws.com/api/v1/subscripe"; // 👈 adjust if your backend route differs

export interface SubscriptionPayload {
  athlete_id: string;
  program_id: string;
  cover_image_url?: string;
}

export interface AthleteSubscription {
  id: string; // subscription id
  athlete_id: string;
  program_id: string; // <- add this if it exists in your API
  cover_image_url?: string;
  programs: {
    id: string; // <- program id from Supabase/DB
    title: string;
    coach_id: string;
    cover_image_url?: string;
  };
  users: {
    first_name: string;
  };
}

export async function createAthleteSubscription(payload: SubscriptionPayload) {
  try {
    const res = await axios.post(
      `${BASE_URL}/create-subscripe-athlete`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Error creating subscription:", err);
    throw err;
  }
}

export async function getSubscriptionsByAthleteId(athlete_id: string) {
  try {
    const res = await axios.get(`${BASE_URL}/${athlete_id}`);
    return res.data.data as AthleteSubscription[];
  } catch (err) {
    console.error("Error fetching athlete subscriptions:", err);
    throw err;
  }
}
