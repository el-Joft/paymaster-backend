import { Body, Controller, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CreateAgentDTO, UpdateAgentStatus } from './agent.dto';
import { AgentService } from './agent.service';

@Controller('agent')
@ApiUseTags('merchant')
export class AgentController {
  public constructor(private agentService: AgentService) {}

  @Post('register')
  public register(@Body() data: CreateAgentDTO): any {

    return this.agentService.register(data);
  }

  @Post('update/status')
  public updateAgentStatus(@Body() data: UpdateAgentStatus): any {

    return this.agentService.updateAgentStatus(data);
  }
}
