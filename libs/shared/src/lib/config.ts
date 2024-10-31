import * as dotenv from 'dotenv';
import * as path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const ConfigSchema = z.object({
  apiAppPort: z.string().transform((val) => Number(val)),
  authAppPort: z.string().transform((val) => Number(val)),
  databaseUrl: z.string(),
  googleClientId: z.string(),
  googleClientSecret: z.string(),
  sessionSecret: z.string(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const config = ConfigSchema.parse({
  apiAppPort: process.env.API_APP_PORT,
  authAppPort: process.env.AUTH_APP_PORT,
  databaseUrl: process.env.DATABASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
});
