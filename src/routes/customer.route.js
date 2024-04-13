'use strict'

const { SERVER } = require('../config');

module.exports = async function customer(fastify) {
  fastify.route({
    method: 'POST',
    url: `${SERVER.API_ROUTE.V1}/customer`,
    schema: {
      summary: 'Create Customer',
      description: 'Create a new customer.',
      consumes: ['application/json'],
      produces: ['application/json'],
      body: {
        type: 'object',
        required: ['name', 'address'],
        properties: {
          name: { type: 'string' },
          phoneNumber: { type: 'string' },
          address: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string' }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function createCustomer(request, reply) {
      const customer = request.body;
      await fastify.customerService.createCustomer(customer);
      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Customer Created' });
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/customer`,
    schema: {
      summary: 'Get customers',
      description: 'Get all customers.',
      produces: ['application/json'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name'],
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              address: { type: 'string' },
              phoneNumber: { type: ['string', 'null'] },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function getCustomers(request, reply) {
      const customers = await fastify.customerService.getCustomers()
      reply
        .code(200)
        .headers('Content-Type', 'application/json')
        .send(customers)
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/customer/:id`,
    schema: {
      summary: 'Get customer',
      description: 'Get customer by Id.',
      produces: ['application/json'],
      response: {
        200: {
          type: 'object',
          required: ['id', 'name'],
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            address: { type: 'string' },
            phoneNumber: { type: ['string', 'null'] },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function getCustomers(request, reply) {
      const customer = await fastify.customerService.getCustomerById(request.params.id);
      reply
        .code(200)
        .send(customer)
    }
  });

  fastify.route({
    method: 'PUT',
    url: `${SERVER.API_ROUTE.V1}/customer/:id`,
    schema: {
      summary: 'Update customer',
      description: 'Update customer properties.',
      consumes: ['application/json'],
      produces: ['application/json'],
      body: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          address: { type: 'string' },
          phoneNumber: { type: ['string', 'null'] }
        }
      },
      response: {
        200: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string' }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function updateCustomer(request, reply) {
      const data = request.body;
      const id = request.params.id;

      await fastify.customerService.updateCustomer(id, data);

      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Customer updated' });
    }
  });

  fastify.route({
    method: 'DELETE',
    url: `${SERVER.API_ROUTE.V1}/customer/:id`,
    schema: {
      summary: 'Delete customer',
      description: 'Delete customer by Id.',
      produces: ['application/json'],
      response: {
        200: {
          type: 'object',
          required: ['message'],
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function deleteCustomer(request, reply) {
      const { id } = request.params

      await fastify.customerService.deleteCustomer(id);

      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'item deleted' });
    }
  });
};
