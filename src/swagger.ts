import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import type { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'OurProject API', version: '1.0.0', description: 'API docs' },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export default function setupSwagger(app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
