import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { config } from './config';
import { rabbitmqService } from './lib/rabbitmq';
import './lib/passport';

const app = express();
const port = config.port;

app.use(express.json());

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: 'Authentication failed' });
    }
    res.status(200).json(req.user);
  }
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

(async () => {
  await rabbitmqService.init();
  rabbitmqService.listenForRequests();
})();
