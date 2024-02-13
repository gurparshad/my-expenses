import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Api',
      version: '1.0.0',
      description: 'Api for expenses',
    },
  },
  apis: ['./src/expenses/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
