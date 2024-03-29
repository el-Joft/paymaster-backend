import { Module } from '@nestjs/common';
import { config } from 'dotenv';

import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

config();
@Module({
  controllers: [AppController],
  imports: [
    UserModule,
    SharedModule,
    AgentModule,
  ],
  providers: [
    AppService,

  ],
})
export class AppModule {}
