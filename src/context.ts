import knex from "knex";
import PondUserController from "./controller/pondUserController";
import PondUserDao from "./dao/pondUserDao";
import PondUserService from "./service/pondUserService";
import dotenv from 'dotenv';


dotenv.config()


const db = knex({
    client: 'pg',
    connection: process.env.PSQL_CONNECTION_STRING
})

const pondUserDao = new PondUserDao(db);
const pondUserService = new PondUserService(pondUserDao);
const pondUserController = new PondUserController(pondUserService);



export { pondUserController };