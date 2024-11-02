import { config, useAuth } from '@/shared';
import express from 'express';
import passport from 'passport';
import * as path from 'path';
import authRouter from './auth.routes';
import { rabbitmqService } from './libs/rabbitmq.lib';
import { googleStrategy } from './strategies/google.strategy';

const app = express();
const port = config.authAppPort;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

useAuth(app);

passport.use(googleStrategy);
app.use(authRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

(async () => {
  await rabbitmqService.init();
  rabbitmqService.listenForRequests();
})();
