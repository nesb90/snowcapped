const { POSTGRES: { SCHEMA }, CONSTANTS } = require('../src/config')
const KnexExtensions = require('../src/db/knex-extensions')


exports.up = async function(knex) {
  const knexHelper = new KnexExtensions(knex);

  await knexHelper.createTable('suppliers', function suppliers (table) {
    table.increments('id');
    table.string('name');
    table.string('phone_number');
    table.string('address');
    table.timestamps(true, true);
  }, SCHEMA);

  await knexHelper.createTable('customers', function customers (table) {
    table.increments('id');
    table.string('name');
    table.string('phone_number');
    table.string('address');
    table.timestamps(true, true);
  }, SCHEMA);

  await knexHelper.createTable('products', function products (table) {
    table.increments('id');
    table.integer('supplier_id')
      .references('id')
      .inTable(this.getTableReferenceWithSchema('suppliers', SCHEMA))
      .notNullable();
    table.string('description');
    table.decimal('retail_price');
    table.decimal('wholesale_price');
    table.timestamps(true, true);
  }, SCHEMA);

  await knexHelper.createTable('sales', function sales (table){
    table.increments('id');
    table.integer('product_id')
      .references('id')
      .inTable(this.getTableReferenceWithSchema('products', SCHEMA))
      .notNullable();
    table.integer('customer_id')
      .references('id')
      .inTable(this.getTableReferenceWithSchema('customers', SCHEMA))
      .notNullable();
    table.integer('productQuantity').notNullable();
    table.enu('sale_type', Object.keys(CONSTANTS.SALE_TYPES));
    table.date('sale_date');
    table.timestamps(true, true);
  }, SCHEMA);

  await knexHelper.createTable('expenses', function expenses (table){
    table.increments('id');
    table.integer('product_id')
      .references('id')
      .inTable(this.getTableReferenceWithSchema('products', SCHEMA))
      .notNullable();
    table.string('description').notNullable();
    table.integer('productQuantity').notNullable();
    table.decimal('price').notNullable();
    table.date('expense_date');
    table.timestamps(true, true);
  }, SCHEMA);
};

exports.down = async function(knex) {
  await knex.schema.withSchema(SCHEMA).dropTable('expenses');
  await knex.schema.withSchema(SCHEMA).dropTable('sales');
  await knex.schema.withSchema(SCHEMA).dropTable('products');
  await knex.schema.withSchema(SCHEMA).dropTable('customers');
  await knex.schema.withSchema(SCHEMA).dropTable('suppliers');
};
