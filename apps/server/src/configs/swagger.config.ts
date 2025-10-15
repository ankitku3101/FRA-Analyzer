import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript API',
    version: '1.0.0',
    description: 'A production-ready Express TypeScript API with best practices',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api/${process.env.API_VERSION || 'v1'}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
};
