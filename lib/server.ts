import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    "https://uivcyyfyefpkieynavgw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmN5eWZ5ZWZwa2lleW5hdmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzI5MTgsImV4cCI6MjA3NDcwODkxOH0.9oDzn_La6VyGy39ujEBA_lZNgVl7x23Cez3FeH9tIrU",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error, if necessary
          }
        },
      },
    }
  );
}
