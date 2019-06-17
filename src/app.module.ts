import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './dbConfig/dbConfig';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

config();
const NODE_ENV = process.env.NODE_ENV || 'development';

const DB_URL = process.env[databaseConfig[NODE_ENV].DB_URL]!;
const entities = process.env[databaseConfig[NODE_ENV].ENTITIES]!;

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      entities: [entities],
      logging: true,
      synchronize: true,
      type: 'postgres',
      url: DB_URL,
    }),
    UserModule,
    SharedModule,
  ],
  providers: [AppService],
})
export class AppModule {}
