/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('plants', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').unique().notNullable();
        table.string('name');
        table.string('description');
        table.string('farmer_time');
        table.string('images');
        table.enum('season', ['dry', 'rainy']).defaultTo('dry');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.string('created_by').nullable();
        table.string('updated_by').nullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('plants');
};
