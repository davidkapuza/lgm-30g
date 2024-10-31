import { redisClient } from '@/shared';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: 'Authentication failed' });
    }
    res.redirect('/');
  }
);

router.get('/logout', (req, res, next) => {
  const sessionId = req.sessionID;

  req.logout((err) => {
    if (err) next(err);

    req.session.destroy(async (err) => {
      if (err) next(err);

      await redisClient.del(sessionId);

      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

export default router;
