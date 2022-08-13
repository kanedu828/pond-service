import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('fish', (table) => {
        table.increments();
        table.integer('length').notNullable();
        table.integer('fish_id').notNullable().index();
        table.integer('fisher_id')
            .notNullable()
            .references('id')
            .inTable('fisher')
            .onDelete('CASCADE')
            .index();
        table.timestamps(true, true);
    });    
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('fish');
}

