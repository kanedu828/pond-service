import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieSesson from 'cookie-session';
import fishingSocket from './sockets/fishing';
import authRouter from './routers/authentication';
import setupAuth from './authSetup';

const app: Application = express();

// TODO: Read docs and configure
app.use(
  cookieSesson({
    name: 'pond-session',
    keys: ['key1', 'key2'],
  })
);

app.use(passport.initialize());
app.use(passport.session());

setupAuth();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});
fishingSocket(io);

app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

server.listen(5000, () => console.log('Server Running'));
