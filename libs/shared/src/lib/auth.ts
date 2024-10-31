import RedisStore from 'connect-redis';
import { Application, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { createClient } from 'redis';
import { config } from './config';

export const redisClient = createClient();
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

const sessionConfig = {
  store: redisStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
};

export function useAuth(app: Application) {
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}
