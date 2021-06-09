import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('dataStreams', table => {
        table.string('key').primary();
        table.string('device_key').references('key').inTable('sensorDevices').notNullable().onDelete('CASCADE');
        table.string('label').notNullable();
        table.boolean('enabled').notNullable();
        table.string('unit_symbol').references('symbol').inTable('measurementUnits').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('dataStreams');
};