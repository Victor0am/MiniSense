import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('sensorData', table => {
        table.dateTime('timestamp').defaultTo(knex.fn.now()).primary();
        table.string('data_key').references('key').inTable('dataStreams').notNullable().onDelete('CASCADE');
        table.double('value').notNullable();
        table.string('unit_symbol').references('symbol').inTable('measurementUnits').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('sensorData');
};