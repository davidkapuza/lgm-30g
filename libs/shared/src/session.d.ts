import { User } from '@/prisma';

declare module 'express-session' {
  interface SessionData {
    passport: { user: User };
  }
}
