import {
  HttpStatus, Inject,
  Injectable,
  Logger, NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { USER_REPOSITORY_TOKEN } from '../common/config/database.tokens.constants';
import {
  NotificationService } from '../shared/notification/notification.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { generateEmailToken } from '../utils/helper';

import { CreateAgentDTO, UpdateAgentStatus } from './agent.dto';

@Injectable()
export class AgentService {
  public constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: Repository<User>,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}
  public async register(agentDTO: CreateAgentDTO): Promise<any> {
    const { email, mobileNumber }: any = agentDTO;
    await this.userService.validateUser({ email, mobileNumber });
    const BASEURL: string = process.env.BASEURL as string;
    const token = generateEmailToken(email);
    const role = await this.userService.getRoleByName('customer');
    const newAgent = await this.userRepository.create(agentDTO);
    newAgent.requestAgent = true;
    newAgent.role = role;
    newAgent.token = token;
    await newAgent.save();
    const message = {
      message: 'Thank you for joining us, Our correspondent will contact you',
      status: HttpStatus.CREATED,
    };

    const link = `${BASEURL}/auth/verification?token=${token}`;

    const mail = await this.notificationService.verificationEmail(
      email,
      link,
      newAgent.businessName,
    );
    Logger.log(mail);
    delete newAgent.password;
    delete newAgent.token;

    return { newAgent, message };

  }

  public async updateAgentStatus(agentData: UpdateAgentStatus): Promise<any> {
    const { agentId, status }: UpdateAgentStatus = agentData;
    try {
      let agent = await this.userRepository.findOne({
        where: { id : agentId },
      });
      if (agent) {
        agent.role = await this.userService.getRoleByName('agent');
        agent.isAgentApproved = status;
        agent.requestAgent = false;
        await agent.save();
        let message;
        agent.isAgentApproved ?
          message = 'Agent account has been approved' :
          message = 'Agent approval has been rejected';
        const messages = {
          message,
          status: HttpStatus.CREATED,
        };
        agent = await this.userRepository.findOne({ where: { id : agentId } });

        return { agent, messages };
      }

    } catch {
      const messages = {
        message: 'Agent does not exist',
      };
      throw new NotFoundException({
        messages,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }
}
