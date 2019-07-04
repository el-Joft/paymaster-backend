import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import {
  NotificationService } from '../shared/notification/notification.service';
import { UserService } from '../user/user.service';

import { AgentController } from './agent.controller';
import { agentProviders } from './agent.providers';
import { AgentService } from './agent.service';

@Module({
  controllers: [AgentController],
  exports: [AgentService],
  imports: [
    DatabaseModule,
  ],
  providers: [
    AgentService,
    NotificationService,
    UserService,
    ...agentProviders,
  ],
})
export class AgentModule {}
