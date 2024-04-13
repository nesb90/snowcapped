'use strict'

const fp = require('fastify-plugin');

const { POSTGRES, NODE_ENV } = require('../config');
const DBService = require('../services/db.service');
const DBPool = require('../db/db.pool');
const CustomerService = require('../services/customer.service');
const SupplierService = require('../services/supplier.service');

function bootstrap (fastify, opts, done) {
  // Services
  const dbPool = new DBPool(POSTGRES.CONFIG);
  const dbService = new DBService(dbPool);
  const customerService = new CustomerService({ dbService });
  const supplierService = new SupplierService({ dbService });
  // decorate server
  fastify.decorate('nodeEnv', NODE_ENV);
  // fastify.decorate('dbService', dbService);
  fastify.decorate('customerService', customerService);
  fastify.decorate('supplierService', supplierService);

  done();
};

module.exports = fp(bootstrap)
