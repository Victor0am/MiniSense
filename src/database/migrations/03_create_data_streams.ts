import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('dataStreams', table => {
        table.increments('oid').primary();
        table.string('key').notNullable();
        table.string('deviceId').references('id').inTable('sensorDevices').notNullable().onDelete('CASCADE');
        table.string('label').notNullable();
        table.boolean('enabled').notNullable();
        table.string('unitId').references('id').inTable('measurementUnits').notNullable();
        table.integer('measurementCount').defaultTo(0);
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('dataStreams');
};