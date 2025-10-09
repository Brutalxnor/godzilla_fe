import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    "https://uivcyyfyefpkieynavgw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmN5eWZ5ZWZwa2lleW5hdmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzI5MTgsImV4cCI6MjA3NDcwODkxOH0.9oDzn_La6VyGy39ujEBA_lZNgVl7x23Cez3FeH9tIrU"
  );
}
export const supabase = createClient();
