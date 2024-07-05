const { CONSTANTS } = require("../config");
const { isRequired, queryBuilder } = require("../utils");

class SalesService {
  constructor({
    dbService = isRequired('dbService')
  }) {
    this.dbService = dbService
    this.tableName = CONSTANTS.TABLE_NAMES.sales
  };

  async createSale (data) {
    try {
      return await this.dbService.doQuery(...queryBuilder.insert(this.tableName, data));
    } catch (error) {
      console.log(error)
      throw error
    };

  };
};

module.exports = SalesService;
