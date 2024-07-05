'use strict'

const { SERVER } = require('../config');

module.exports = async function sales(fastify) {
  fastify.route({
    method: 'POST',
    url: `${SERVER.API_ROUTE.V1}/sales`,
    schema: {
      summary: 'Create Sales',
      description: 'Create a new sales.',
      consumes: ['application/json'],
      produces: ['application/json'],
      body: {
        type: 'object',
        required: ['productId', 'customerId', 'priceId', 'amount', 'saleType', 'saleDate'],
        properties: {
          productId: { type: 'number' },
          customerId: { type: 'number' },
          priceId: { type: 'number' },
          amount: { type: 'string' },
          saleType: { type: 'string' },
          saleDate: { type: 'string' }
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
    handler: async function createSale(request, reply) {
      const sale = request.body;
      try {
        await fastify.salesService.createSale(sale);
        reply
          .code(200)
          .header('Content-Type', 'application/json')
          .send({ message: 'Sales Created' });
      } catch (error) {
        if (error?.code) {
          reply
            .code(error.code)
            .send({ message: error.message });
        } else {
          reply.code(500).send({ message: error.message });
        };
      };

    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/sales`,
    schema: {
      summary: 'Get sales',
      description: 'Get all sales.',
      produces: ['application/json'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            required: ['productId', 'supplierId', 'supplierName', 'description', 'wholesalePrice', 'purchasePrice'],
            properties: {
              productId: { type: 'number' },
              description: { type: 'string' },
              supplierId: { type: 'number' },
              supplierName: { type: 'string' },
              wholesalePrice: { type: 'string' },
              retailPrice: { type: 'string' },
              purchasePrice: { type: 'string' }
            }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function getProducts(request, reply) {
      const sales = await fastify.productService.getProducts();
      reply
        .code(200)
        .headers('Content-Type', 'application/json')
        .send(sales)
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/sales/:id`,
    schema: {
      summary: 'Get sales',
      description: 'Get sales by Id.',
      produces: ['application/json'],
      response: {
        200: {
          type: 'object',
          required: ['productId', 'supplierId', 'supplierName', 'description', 'wholesalePrice', 'purchasePrice'],
          properties: {
            productId: { type: 'number' },
            description: { type: 'string' },
            supplierId: { type: 'number' },
            supplierName: { type: 'string' },
            wholesalePrice: { type: 'string' },
            retailPrice: { type: 'string' },
            purchasePrice: { type: 'string' }
          }
        },
        400: { $ref: 'badRequestResponse#' },
        401: { $ref: 'unauthorizedResponse#' },
        404: { $ref: 'notFoundResponse#' },
        500: { $ref: 'systemErrorResponse#' }
      }
    },
    handler: async function getProductById(request, reply) {
      try {
        const sales = await fastify.productService.getProductById(request.params.id);
        reply
          .code(200)
          .send(sales)
      } catch (error) {
        console.log('something went wrong----', error);
        reply()
      };
    }
  });

  fastify.route({
    method: 'PUT',
    url: `${SERVER.API_ROUTE.V1}/sales/:id`,
    schema: {
      summary: 'Update sales',
      description: 'Update sales properties.',
      consumes: ['application/json'],
      produces: ['application/json'],
      body: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          supplierId: { type: 'number' },
          wholesalePrice: { type: 'string' },
          retailPrice: { type: 'string' },
          purchasePrice: { type: 'string' }
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
    handler: async function updateProduct(request, reply) {
      const data = request.body;
      const id = request.params.id;

      await fastify.productService.updateProduct(id, data);

      reply
        .code(200)
        .header('Content-Type', 'application/json')
        .send({ message: 'Sales updated' });
    }
  });

  fastify.route({
    method: 'DELETE',
    url: `${SERVER.API_ROUTE.V1}/sales/:id`,
    schema: {
      summary: 'Delete sales',
      description: 'Delete sales by Id.',
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
    handler: async function deleteProduct(request, reply) {
      try {
        const { id } = request.params
        await fastify.productService.deleteProduct(id);
        reply
          .code(200)
          .header('Content-Type', 'application/json')
          .send({ message: 'Sales deleted' });
      } catch (error) {
        console.log('something went wrong----', error);
        const errorCode = error.statusCode || error.code || error.errorCode || 500
        reply.code(errorCode).send();
      };
    }
  });
};
