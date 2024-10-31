import { config, useAuth } from '@/shared';
import express from 'express';
import proxy from 'express-http-proxy';
import * as path from 'path';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

useAuth(app);

const auth = proxy('http://localhost:8001');
const analytics = proxy('http://localhost:8002');

app.use('/api/auth', auth);
app.use('/api/analytics', analytics);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const port = config.apiAppPort;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
