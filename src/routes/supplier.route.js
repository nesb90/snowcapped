'use strict'

const { SERVER } = require('../config');

module.exports = async function supplier(fastify) {
  fastify.route({
    method: 'POST',
    url: `${SERVER.API_ROUTE.V1}/supplier`,
    schema: {
      summary: 'Create Supplier',
      description: 'Create a new supplier.',
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
    handler: async function createSupplier(request, reply) {
      const supplier = request.body;
      await fastify.supplierService.createSupplier(supplier);
      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Supplier Created' });
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/supplier`,
    schema: {
      summary: 'Get suppliers',
      description: 'Get all suppliers.',
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
    handler: async function getSuppliers(request, reply) {
      const suppliers = await fastify.supplierService.getSuppliers()
      reply
        .code(200)
        .headers('Content-Type', 'application/json')
        .send(suppliers)
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/supplier/:id`,
    schema: {
      summary: 'Get supplier',
      description: 'Get supplier by Id.',
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
    handler: async function getSuppliers(request, reply) {
      const supplier = await fastify.supplierService.getSupplierById(request.params.id);
      reply
        .code(200)
        .send(supplier)
    }
  });

  fastify.route({
    method: 'PUT',
    url: `${SERVER.API_ROUTE.V1}/supplier/:id`,
    schema: {
      summary: 'Update supplier',
      description: 'Update supplier properties.',
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
    handler: async function updateSupplier(request, reply) {
      const data = request.body;
      const id = request.params.id;

      await fastify.supplierService.updateSupplier(id, data);

      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Supplier updated' });
    }
  });

  fastify.route({
    method: 'DELETE',
    url: `${SERVER.API_ROUTE.V1}/supplier/:id`,
    schema: {
      summary: 'Delete supplier',
      description: 'Delete supplier by Id.',
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
    handler: async function deleteSupplier(request, reply) {
      const { id } = request.params

      await fastify.supplierService.deleteSupplier(id);

      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Supplier deleted' });
    }
  });
};
