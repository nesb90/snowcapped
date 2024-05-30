'use strict'

const { SERVER } = require('../config');

module.exports = async function products(fastify) {
  fastify.route({
    method: 'POST',
    url: `${SERVER.API_ROUTE.V1}/products`,
    schema: {
      summary: 'Create Products',
      description: 'Create a new products.',
      consumes: ['application/json'],
      produces: ['application/json'],
      body: {
        type: 'object',
        required: ['description', 'supplier', 'wholesalePrice', 'retailPrice', 'purchasePrice'],
        properties: {
          description: { type: 'string' },
          supplier: { type: 'number' },
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
    handler: async function createProduct(request, reply) {
      const product = request.body;
      try {
        await fastify.productService.createProduct(product);
        reply
          .code(200)
          .header('Content-Type', 'application/json')
          .send({ message: 'Products Created' });
      } catch (error) {
        if (error?.code) {
          reply
            .code(error.code);
        } else {
          reply.code(500);
        };
      };

    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/products`,
    schema: {
      summary: 'Get products',
      description: 'Get all products.',
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
      const products = await fastify.productService.getProducts();
      reply
        .code(200)
        .headers('Content-Type', 'application/json')
        .send(products)
    }
  });

  fastify.route({
    method: 'GET',
    url: `${SERVER.API_ROUTE.V1}/products/:id`,
    schema: {
      summary: 'Get products',
      description: 'Get products by Id.',
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
        const products = await fastify.productService.getProductById(request.params.id);
        reply
          .code(200)
          .send(products)
      } catch (error) {
        console.log('something went wrong----', error);
        reply()
      };
    }
  });

  fastify.route({
    method: 'PUT',
    url: `${SERVER.API_ROUTE.V1}/products/:id`,
    schema: {
      summary: 'Update products',
      description: 'Update products properties.',
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
        .send({ message: 'Products updated' });
    }
  });

  fastify.route({
    method: 'DELETE',
    url: `${SERVER.API_ROUTE.V1}/products/:id`,
    schema: {
      summary: 'Delete products',
      description: 'Delete products by Id.',
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
          .send({ message: 'Products deleted' });
      } catch (error) {
        console.log('something went wrong----', error);
        const errorCode = error.statusCode || error.code || error.errorCode || 500
        reply.code(errorCode).send();
      };
    }
  });
};
