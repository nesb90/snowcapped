const {
  isRequired,
  queryBuilder,
  parseDataArray,
  parseData
} = require("../utils");
const { CONSTANTS } = require('../config');

class CustomerService {
  constructor({
    dbService = isRequired('dbService')
  }) {
    this.dbService = dbService
  };

  async createCustomer (customer) {
    return await this.dbService.doQuery(...queryBuilder.insert(CONSTANTS.TABLE_NAMES.customers, customer));
  };

  async getCustomers () {
    const customers = await this.dbService.doQuery(queryBuilder.select(CONSTANTS.TABLE_NAMES.customers));
    return parseDataArray(customers);
  };

  async getCustomerById (id) {
    const [customer] = await this.dbService.doQuery(...queryBuilder.select(CONSTANTS.TABLE_NAMES.customers, id));
    return parseData(customer);
  };

  async updateCustomer (id, data) {
    return await this.dbService.doQuery(queryBuilder.update(CONSTANTS.TABLE_NAMES.customers, id, data));
  };

  async deleteCustomerById (id) {
    return await this.dbService.doQuery(...queryBuilder.remove(CONSTANTS.TABLE_NAMES.customers, id));
  };
};

module.exports = CustomerService;
