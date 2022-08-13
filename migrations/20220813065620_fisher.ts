import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('fisher', (table) => {
        table.increments();
        table.integer('exp').notNullable().defaultTo(0);
        table.string('location').notNullable().defaultTo('');
        table.integer('pond_user_id')
            .notNullable()
            .unique()
            .references('id')
            .inTable('pond_user')
            .onDelete('CASCADE')
            .index();
        table.timestamps(true, true);
    });    
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('fisher');
}

