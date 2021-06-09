import {Knex} from 'knex';

//criar tabela de Users

export async function up(knex: Knex){
    return knex.schema.createTable('measurementUnits', table =>{
        table.string('symbol').primary();
        table.string('description').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex){
    return knex.schema.dropTable('measurementUnits');
};