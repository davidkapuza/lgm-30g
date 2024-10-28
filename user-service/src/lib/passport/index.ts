import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "src/config/index.js";
import { prisma } from "../prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: "http://localhost:8000/auth/google/callback",
      passReqToCallback: true,
    },

    async (_, __, ___, profile, done) => {
      const exist = await prisma.user.findUnique({
        where: {
          email: profile.emails?.[0]?.value,
        },
      });

      if (!exist) {
        const user = await prisma.user.create({
          data: {
            email: profile.emails![0]!.value,
            name: profile.displayName,
          },
        });
        return done(null, user);
      }

      return done(null, exist);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});
