import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  NotificationService,
} from '../shared/notification/notification.service';

import { GoogleStrategy } from './google.strategy';
import { Role } from './role.entity';
import { SocialAuth } from './SocialAuth.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, Role, SocialAuth])],
  providers: [UserService, NotificationService, GoogleStrategy],
})
export class UserModule {}
