import { config } from 'dotenv';

config();

export const {
  PORT,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} = process.env as { [k: string]: string };
