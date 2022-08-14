import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import cookieSession from 'cookie-session';
import knex from 'knex';
import fishingSocket from './sockets/fishing';
import authRouter from './routers/authentication';
import setupAuth from './authSetup';
import { isLoggedIn } from './middleware';
import PondUserController from './controller/pondUserController';
import FishingController from './controller/fishingController';

const app: Application = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:3000'],
    credentials: true,
  })
);

const sessionMiddleware = cookieSession({
  name: 'pond-session',
  keys: ['key1', 'key2'],
});

// App middleware
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// -------DB, DAO, Service, and Controller Initialization-------
const db = knex({
  client: 'pg',
  connection: process.env.PSQL_CONNECTION_STRING,
});

const pondUserController = new PondUserController(db);
const fishingController = new FishingController();
// ------------------------------------------------------------

setupAuth(pondUserController);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://127.0.0.1:3000'],
    credentials: true,
  },
});

// Socket io middleware
const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use(wrap(isLoggedIn));

fishingSocket(io, fishingController);

app.use('/auth', authRouter);

server.listen(5000, () => console.log('Server Running'));
