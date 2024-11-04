import { useAuth } from '@/shared';
import express from 'express';
import * as path from 'path';
import analyticsRouter from './analytics.routes';
import RabbitMQClient from './libs/rabbitmq/client';

const app = express();
const port = process.env.ANALYTICS_APP_PORT || 8001;

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

useAuth(app);

app.use(analyticsRouter);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
  RabbitMQClient.initialize();
});
server.on('error', console.error);
