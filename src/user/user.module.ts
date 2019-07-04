import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import {
  NotificationService,
} from '../shared/notification/notification.service';

import { GoogleStrategy } from './google.strategy';
import { UserController } from './user.controller';
import { usersProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    DatabaseModule,
  ],
  providers: [
    UserService,
    NotificationService,
    ...usersProviders, GoogleStrategy],
})
export class UserModule {}
