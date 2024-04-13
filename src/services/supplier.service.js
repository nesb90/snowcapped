const {
    isRequired,
    queryBuilder,
    parseDataArray,
    parseData
  } = require("../utils");
  const { CONSTANTS } = require('../config');

  class SupplierService {
    constructor({
      dbService = isRequired('dbService')
    }) {
      this.dbService = dbService
    };

    async createSupplier (supplier) {
      return await this.dbService.doQuery(...queryBuilder.insert(CONSTANTS.TABLE_NAMES.suppliers, supplier));
    };

    async getSuppliers () {
      const suppliers = await this.dbService.doQuery(queryBuilder.select(CONSTANTS.TABLE_NAMES.suppliers));
      return parseDataArray(suppliers);
    };

    async getSupplierById (id) {
      const [supplier] = await this.dbService.doQuery(...queryBuilder.select(CONSTANTS.TABLE_NAMES.suppliers, id));
      return parseData(supplier);
    };

    async updateSupplier (id, data) {
      return await this.dbService.doQuery(queryBuilder.update(CONSTANTS.TABLE_NAMES.suppliers, id, data));
    };

    async deleteSupplierById (id) {
      return await this.dbService.doQuery(...queryBuilder.remove(CONSTANTS.TABLE_NAMES.suppliers, id));
    };
  };

  module.exports = SupplierService;
