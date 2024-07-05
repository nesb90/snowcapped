const { POSTGRES: { SCHEMA }, CONSTANTS } = require('../src/config')
const KnexExtensions = require('../src/db/knex-extensions')


exports.up = async function (knex) {
  const knexHelper = new KnexExtensions(knex);

  await knexHelper.alterTable(CONSTANTS.TABLE_NAMES.sales, function alterSales(table) {
    table.integer('price_id');
    table.dropColumn('productQuantity');
    table.decimal('amount', 8, 2);
  }, SCHEMA);
}

exports.down = async function (knex) {
  const knexHelper = new KnexExtensions(knex);

  await knexHelper.alterTable(CONSTANTS.TABLE_NAMES.sales, function alterSales(table) {
    table.dropColumn('price_id');
    table.dropColumn('amount');
    table.decimal('productQuantity', 8, 2);
  }, SCHEMA);
};
