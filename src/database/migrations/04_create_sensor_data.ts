import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('sensorData', table => {
        table.increments('id').primary();
        table.string('timestamp').notNullable();
        table.string('dataId').references('oid').inTable('dataStreams').notNullable().onDelete('CASCADE');
        table.double('value').notNullable();
        table.string('unitId').references('id').inTable('measurementUnits').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('sensorData');
};