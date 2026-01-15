// import 'reflect-metadata';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { json } from 'sequelize';
// import { urlencoded } from 'express';



// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const port = process.env.NEST_PORT || process.env.PORT || 5000;
// //   const config = new DocumentBuilder()
// //   .setTitle('OurProject API')
// //   .setDescription('API docs')
// //   .setVersion('1.0')
// //   .build();
// //   console.log('Creating swagger document...');

// // const document = SwaggerModule.createDocument(app, config);
// // console.log('Schemas:', Object.keys(document.components?.schemas || {}));
// // SwaggerModule.setup('docs', app, document);
// app.use(json({ limit: '10mb' }));
// app.use(urlencoded({ extended: true, limit: '10mb' }));

// app.enableCors({
//   origin: 'http://localhost:3000',
// });

// await app.listen(port);
//   console.log(`Nest app listening on port ${port}`);
// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Global diagnostic handlers to capture unexpected runtime exits
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception (global):', err && (err.stack || err.message || err));
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection (global):', reason);
});
process.on('exit', (code) => {
  console.warn('Process exit event fired with code:', code);
});
process.on('beforeExit', (code) => {
  console.warn('Process beforeExit event fired with code:', code);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.NEST_PORT || process.env.PORT || 5000;

  // ✅ Middleware אמיתיים בלבד מ-express
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // // Setup Swagger
  // const config = new DocumentBuilder()
  //   .setTitle('OurProject API')
  //   .setDescription('API docs')
  //   .setVersion('1.0')
  //   .build();
  // console.log('📘 Creating swagger document...');
  // const document = SwaggerModule.createDocument(app, config);
  // console.log('Schemas:', Object.keys(document.components?.schemas || {}));
  // SwaggerModule.setup('docs', app, document);

  // Ensure students id sequence doesn't conflict with existing rows (fix for duplicate PK on insert)
  try {
    const sequelize = app.get(Sequelize);
    await sequelize.authenticate();
    await sequelize.query(`SELECT setval(pg_get_serial_sequence('students','id'), (SELECT COALESCE(MAX(id),0) FROM students) + 1, false);`);
    console.log('✅ Student id sequence checked/reset');
  } catch (e:any) {
    console.warn('⚠️ Could not reset students id sequence:', e?.message || e);
  }

  await app.listen(port);
  console.log(`✅ Nest app listening on port ${port}`);
}

bootstrap();
