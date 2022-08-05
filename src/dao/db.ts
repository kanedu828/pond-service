import knex from 'knex';


const pg = knex({
    client: 'pg',
    connection: process.env.PSQL_CONNECTION_STRING
})

export default pg;