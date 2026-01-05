import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.NEST_PORT || process.env.PORT || 5000;
//   const config = new DocumentBuilder()
//   .setTitle('OurProject API')
//   .setDescription('API docs')
//   .setVersion('1.0')
//   .build();
//   console.log('Creating swagger document...');

// const document = SwaggerModule.createDocument(app, config);
// console.log('Schemas:', Object.keys(document.components?.schemas || {}));
// SwaggerModule.setup('docs', app, document);
  await app.listen(port);
  console.log(`Nest app listening on port ${port}`);
}

bootstrap();
