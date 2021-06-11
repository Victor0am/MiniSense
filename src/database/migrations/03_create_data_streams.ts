import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('dataStreams', table => {
        table.increments('id').primary();
        table.string('key').notNullable();
        table.string('device_id').references('id').inTable('sensorDevices').notNullable().onDelete('CASCADE');
        table.string('label').notNullable();
        table.boolean('enabled').notNullable();
        table.string('unit_id').references('id').inTable('measurementUnits').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('dataStreams');
};