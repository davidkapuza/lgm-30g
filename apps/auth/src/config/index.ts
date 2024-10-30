import path from "path";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const ConfigSchema = z.object({
  port: z.string().transform((val) => Number(val)),
  databaseUrl: z.string(),
  googleClientId: z.string(),
  googleClientSecret: z.string(),
  sessionSecret: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config = ConfigSchema.parse({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
});
