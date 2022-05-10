import { config } from "dotenv";

config();

export const { PORT, DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PASSWORD } =
  process.env as { [k: string]: string };
