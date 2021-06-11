import { Knex } from 'knex';

//criar tabela de Users

export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('username').notNullable();
    });
};

//deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
};