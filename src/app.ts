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
import cookieSession from 'cookie-session';

const app: Application = express();

const POND_WEB_URL: string = process.env.POND_WEB_URL ?? '';
const POND_SERVICE_PORT: string = process.env.POND_SERVICE_PORT ?? '';
const SESSION_SECRET: string = process.env.SESSION_SECRET ?? '';
const COOKIE_SECRET: string = process.env.COOKIE_SECRET ?? '';

app.use(cookieSession({
  name: 'pondSession',
  secret: COOKIE_SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(
  cors({
    origin: [POND_WEB_URL],
    credentials: true
  })
);

let sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  },
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionConfig.cookie.secure = true // serve secure cookies
}

const sessionMiddleware = session(sessionConfig);

// App middleware
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// -------DB, DAO, Service, and Controller Initialization-------
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.PSQL_CONNECTION_STRING,
  },
  pool: { min: 0, max: 7 },
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
    origin: [POND_WEB_URL],
    credentials: true
  }
});

// Socket io middleware
const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use(wrap(isLoggedIn));

fishingSocket(io, fishingController);

app.use('/auth', getAuthenticationRouter());
app.use('/user', getUserRouter(pondUserController));

server.listen(POND_SERVICE_PORT, () => console.log('Server Running'));

pondUserLogger.info('Pond Service Start');
