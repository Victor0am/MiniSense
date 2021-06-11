import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('sensorData', table => {
        table.increments('id').primary();
        table.dateTime('timestamp').defaultTo(knex.fn.now()).notNullable();
        table.string('data_id').references('id').inTable('dataStreams').notNullable().onDelete('CASCADE');
        table.double('value').notNullable();
        table.string('unit_id').references('id').inTable('measurementUnits').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('sensorData');
};