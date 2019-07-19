import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { ValidationPipe } from './shared/validation.pipe';
const PORT = process.env.PORT || 4000;

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('PayMaster API')
    .setDescription('The PayMaster API description')
    .setVersion('1.0')
    .addTag('PayMaster')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
})();
