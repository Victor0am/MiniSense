import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('sensorDevices', table => {
        table.increments('id').primary();
        table.string('key').notNullable();
        table.string('userId').references('id').inTable('users').onDelete('CASCADE');
        table.string('label').notNullable();
        table.string('description').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('sensorDevices');
};