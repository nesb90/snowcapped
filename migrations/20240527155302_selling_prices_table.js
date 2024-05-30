const { POSTGRES: { SCHEMA }, CONSTANTS } = require('../src/config')
const KnexExtensions = require('../src/db/knex-extensions')


exports.up = async function (knex) {
  const knexHelper = new KnexExtensions(knex);

  await knexHelper.createTable(CONSTANTS.TABLE_NAMES.prices, function prices(table) {
    table.increments('id');
    table.integer('product_id')
      .references('id')
      .inTable(this.getTableReferenceWithSchema(CONSTANTS.TABLE_NAMES.products, SCHEMA))
      .notNullable();
    table.decimal('purchase_price', 8, 2);
    table.decimal('wholesale_price', 8, 2);
    table.decimal('retail_price', 8, 2);
    table.timestamps(true, true)
    table.date('deleted_at');
  }, SCHEMA);

  await knexHelper.alterTable(CONSTANTS.TABLE_NAMES.products, function alterProducts(table) {
    table.dropColumn('retail_price');
    table.dropColumn('wholesale_price');
  }, SCHEMA);
}

exports.down = async function (knex) {
  const knexHelper = new KnexExtensions(knex);

  await knexHelper.alterTable(CONSTANTS.TABLE_NAMES.products, function alterProducts(table) {
    table.decimal('retail_price');
    table.decimal('wholesale_price');
  }, SCHEMA);
  await knex.schema.withSchema(SCHEMA).dropTable(CONSTANTS.TABLE_NAMES.prices);
};
