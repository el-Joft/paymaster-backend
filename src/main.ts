import { NestFactory } from '@nestjs/core';
import 'dotenv/config';

import { AppModule } from './app.module';
import { ValidationPipe } from './shared/validation.pipe';
const PORT = process.env.PORT || 4000;

(async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
})();
