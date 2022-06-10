import { config } from 'dotenv';

config();

export const {
  PORT,
  JWT_SECRET,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} = process.env as { [k: string]: string };
