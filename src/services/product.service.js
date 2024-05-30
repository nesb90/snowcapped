const {
  isRequired,
  queryBuilder,
  parseDataArray,
  parseData
} = require("../utils");
const { CONSTANTS, POSTGRES } = require('../config');

class ProductService {
  constructor({
    dbService = isRequired('dbService')
  }) {
    this.dbService = dbService;
    this.schema = POSTGRES.SCHEMA;
    this.tableName = CONSTANTS.TABLE_NAMES.products;
    this.productsQuery = `
    SELECT
      pro.id as product_id,
      sup.id as supplier_id,
      sup.name as supplier_name,
      pro.description,
      pro.created_at,
      pri.purchase_price,
      pri.wholesale_price,
      pri.retail_price
    FROM ${this.schema}.${this.tableName} pro
    JOIN ${this.schema}.${CONSTANTS.TABLE_NAMES.suppliers} sup
      ON pro.supplier_id = sup.id
    JOIN ${this.schema}.${CONSTANTS.TABLE_NAMES.prices} pri
      ON pri.product_id = pro.id`;
  };

  getDecimalValue(price) {
    return parseFloat(price).toFixed(2)
  };

  async createProduct(product) {
    const result = await this.dbService.doQuery(`INSERT INTO ${this.schema}.${this.tableName} (supplier_id, description) VALUES ($1, $2) RETURNING id;`, [product.supplier, product.description]);
    await this.dbService.doQuery(`
    INSERT INTO ${this.schema}.${CONSTANTS.TABLE_NAMES.prices} (product_id, purchase_price, wholesale_price, retail_price, created_at) VALUES
    ($1, $2, $3, $4, $5)
  `, [result[0].id, this.getDecimalValue(product.purchasePrice), this.getDecimalValue(product.wholesalePrice), this.getDecimalValue(product.retailPrice), new Date()])
  };

  async getProducts() {
    const result = await this.dbService.doQuery(this.productsQuery);
    return parseDataArray(result);
  };

  async getProductById(id) {
    const query = `${this.productsQuery}
      WHERE pro.id = $1
    `
    const [product] = await this.dbService.doQuery(query, [id]);
    return parseData(product);
  };

  async updateProduct(id, data) {
    return await this.dbService.doQuery(queryBuilder.update(this.tableName, id, data));
  };

  async deleteProduct(id) {
    await this.dbService.doQuery(`DELETE FROM ${this.schema}.${CONSTANTS.TABLE_NAMES.prices} p where p.product_id='${id}'`)
    return await this.dbService.doQuery(queryBuilder.remove(this.tableName, id));
  };
};

module.exports = ProductService;
