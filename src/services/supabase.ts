import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://iwxemvybicrientrkyzs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGVtdnliaWNyaWVudHJreXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MTAyODQsImV4cCI6MjA0NTk4NjI4NH0.j09YIl5rg3edUUk3OGPACwzxibdyqlEup-Lrye7i8uY";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
