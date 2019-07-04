import { Connection } from 'typeorm';

import {
  DB_CONNECTION_TOKEN, ROLE_REPOSITORY_TOKEN, SOCIALAUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../common/config/database.tokens.constants';
import { Role } from '../user/role.entity';
import { SocialAuth } from '../user/SocialAuth.entity';
import { User } from '../user/user.entity';

export const agentProviders = [
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): any => connection.getRepository(User),
  },
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: SOCIALAUTH_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): any => connection.getRepository(SocialAuth),
  },
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: ROLE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): any => connection.getRepository(Role),
  },
];
