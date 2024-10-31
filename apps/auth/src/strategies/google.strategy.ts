import { prisma } from '@/prisma';
import { config } from '@/shared';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const googleStrategy = new GoogleStrategy(
  {
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: 'http://localhost:8000/api/auth/google/callback',
    passReqToCallback: true,
  },
  async (_, __, ___, profile, done) => {
    if (!Array.isArray(profile.emails)) throw new Error('Profile has no email');

    const exist = await prisma.user.findUnique({
      where: {
        email: profile.emails[0].value,
      },
    });
    if (!exist) {
      const user = await prisma.user.create({
        data: {
          email: profile.emails[0].value,
          name: profile.displayName,
        },
      });
      return done(null, user);
    }
    return done(null, exist);
  }
);
