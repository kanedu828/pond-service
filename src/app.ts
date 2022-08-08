import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieSesson from 'cookie-session';
import cors from 'cors';
import fishingSocket from './sockets/fishing';
import authRouter from './routers/authentication';
import setupAuth from './authSetup';

const corsConfig: any = {
  cors: {
    origin: ['http://127.0.0.1:3000'],
  },
};

const app: Application = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:3000'],
    credentials: true,
  })
);

// TODO: Read docs and configure
const session = cookieSesson({
  name: 'pond-session',
  keys: ['key1', 'key2'],
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

setupAuth();

const server = http.createServer(app);
const io = new Server(server, corsConfig);

const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

io.use(wrap(session));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
// io.use(isLoggedInSocket);

fishingSocket(io);

app.use('/auth', authRouter);

server.listen(5000, () => console.log('Server Running'));
