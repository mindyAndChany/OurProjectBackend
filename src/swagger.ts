import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import type { Application } from 'express';

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
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string' }
          },
          required: ['id', 'name', 'type']
        },
        Class: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            course_id: { type: 'integer' },
            name: { type: 'string' },
            year: { type: 'integer' },
            teacher_name: { type: 'string' },
            base_schedule: { type: 'string' }
          },
          required: ['id', 'course_id', 'name']
        },
        WeeklySchedule: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            class_id: { type: 'integer' },
            day_of_week: { type: 'integer', description: '1=Sunday ... 7=Saturday' },
            start_time: { type: 'string' },
            end_time: { type: 'string' },
            topic_id: { type: 'integer' },
            topicRef: { $ref: '#/components/schemas/Topic' },
            teacher_name: { type: 'string' }
          },
          required: ['id', 'class_id', 'day_of_week', 'start_time', 'end_time']
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            class_id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            start_time: { type: 'string' },
            end_time: { type: 'string' },
            topic_id: { type: 'integer' },
            topicRef: { $ref: '#/components/schemas/Topic' },
            teacher_name: { type: 'string' },
            is_cancelled: { type: 'boolean', default: false, description: 'האם השיעור בוטל' },
            cancellation_reason: { type: 'string', description: 'סיבת הביטול' }
          },
          required: ['id', 'class_id', 'date', 'start_time', 'end_time']
        },

        Topic: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          },
          required: ['id', 'name']
        },

        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            student_id: { type: 'integer' },
            lesson_id: { type: 'integer' },
            status: {
              type: 'string',
              enum: ['present', 'late', 'absent', 'approved absent']
            }
          },
          required: ['id', 'student_id', 'lesson_id', 'status']
        },

        StudentAchievement: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            student_id: { type: 'integer' },
            topic: { type: 'string' },
            semester: { type: 'string', description: 'e.g. שנה א מחצית א' },
            final_grade: { type: 'number', format: 'float', nullable: true },
            attendance_percentage: { type: 'number', format: 'float' },
            created_at: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'student_id', 'topic', 'semester', 'attendance_percentage']
        },

        StudentAchievementCreateRequest: {
          type: 'object',
          properties: {
            student_id: { type: 'integer' },
            topic: { type: 'string' },
            semester: { type: 'string' },
            final_grade: { type: 'number', format: 'float', nullable: true },
            attendance_percentage: { type: 'number', format: 'float' }
          },
          required: ['student_id', 'topic', 'semester', 'attendance_percentage']
        },

        StudentAchievementUpdateRequest: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            semester: { type: 'string' },
            final_grade: { type: 'number', format: 'float', nullable: true },
            attendance_percentage: { type: 'number', format: 'float' }
          }
        },

        SemesterBoundary: {
          type: 'object',
          properties: {
            year: { type: 'integer', description: 'students.registration_year' },
            switch_date: { type: 'string', format: 'date' }
          },
          required: ['year', 'switch_date']
        },

        SemesterBoundaryCreateRequest: {
          type: 'object',
          properties: {
            year: { type: 'integer' },
            switch_date: { type: 'string', format: 'date' }
          },
          required: ['year', 'switch_date']
        },

        SemesterBoundaryUpdateRequest: {
          type: 'object',
          properties: {
            switch_date: { type: 'string', format: 'date' }
          }
        },

      },
    },
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
  // apis: ['./dist/routes/**/*.js', './dist/controllers/**/*.js'],
};


export const swaggerSpec = swaggerJSDoc(options);

export default function setupSwagger(app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
