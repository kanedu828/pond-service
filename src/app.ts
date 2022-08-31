import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import knex from 'knex';
import session from 'express-session';
import fishingSocket from './sockets/fishing';
import getAuthenticationRouter from './routers/authentication';
import { isLoggedIn, setupAuth } from './util/middleware';
import PondUserController from './controller/pondUserController';
import FishingController from './controller/fishingController';
import PondUserDao from './dao/pondUserDao';
import FishDao from './dao/fishDao';
import getUserRouter from './routers/user';
import { pondUserLogger } from './util/logger';


const app: Application = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:3000'],
    credentials: true,
  })
);

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
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

const pondUserDao = new PondUserDao(db);
const fishDao = new FishDao(db);
const pondUserController = new PondUserController(pondUserDao, fishDao);
const fishingController = new FishingController(pondUserDao, fishDao);
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

app.use('/auth', getAuthenticationRouter());
app.use('/user', getUserRouter(pondUserController));

server.listen(5000, () => console.log('Server Running'));

pondUserLogger.info('Pond Service Start');