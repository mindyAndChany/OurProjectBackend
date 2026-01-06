import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import type { Application } from 'express';
console.log('✅ swagger.ts LOADED');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OurProject API',
      version: '1.0.0',
      description: 'API docs',
    },
    components: {
      schemas: {
        AuthLoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        AuthLoginResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            institution_code: { type: 'string' },
            role: { type: 'string' },
            permissions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Permission',
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        Permission: {
          type: 'object',
          properties: {
            screen_name: { type: 'string' },
            can_view: { type: 'boolean' },
            can_edit: { type: 'boolean' },
          },
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            id_number: { type: 'string' },
            phone: { type: 'string' },
            marital_status: { type: 'string' },
            address: { type: 'string' },
            registration_year: { type: 'integer' },
            is_graduate: { type: 'boolean' },
            class_kodesh: { type: 'string' },
            class_teaching: { type: 'string' },
            track: { type: 'string' },
            track2: { type: 'string' },
            track3: { type: 'string' },
            payment_status: { type: 'string' },
            paid_amount: {
              type: 'number',
              format: 'float'
            },
            birthdate_gregorian: {
              type: 'string',
              format: 'date'
            },
            birthdate_hebrew: { type: 'string' },
            married_date: {
              type: 'string',
              format: 'date'
            },
            married_name: { type: 'string' },
            notes: { type: 'string' }
          },
          required: [
            'id',
            'first_name',
            'last_name',
            'id_number',
            'registration_year',
            'is_graduate'
          ]
        },
        CalendarEvent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            type: { type: 'string' },
            date: {
              type: 'string',
              format: 'date'
            },
            time_start: {
              type: 'string',
              format: 'time'
            },
            time_end: {
              type: 'string',
              format: 'time'
            },
            notes: { type: 'string' }
          },
          required: ['id', 'title', 'date']
        },

      },
    },
  },
  apis: ['./dist/routes/**/*.js', './dist/controllers/**/*.js'],
};


export const swaggerSpec = swaggerJSDoc(options);
console.log(
  'Swagger spec paths:',
  Object.keys((swaggerSpec as any).paths || {})
);
export default function setupSwagger(app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📘 Swagger route set up at /docs');

}
