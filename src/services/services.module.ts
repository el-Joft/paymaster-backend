import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { DatabaseQuery } from '../shared/database';

import { ServicesController } from './services.controller';
import { serviceProviders } from './services.providers';
import { ServicesService } from './services.service';

@Module({
  controllers: [ServicesController],
  imports: [
    DatabaseModule,
  ],
  providers: [
    DatabaseQuery,
    ServicesService,
    ...serviceProviders],
})
export class ServicesModule {}
