import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("⚡ Supabase Cloud PostgreSQL Client Initialized Successfully!");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase client:", err.message);
  }
} else {
  console.log("ℹ️  No SUPABASE_URL / SUPABASE_KEY in .env — using Persistent Campus JSON DB with automatic disk sync.");
}

export const getSupabase = () => supabase;
export const isSupabaseConfigured = () => Boolean(supabase);
