import { Connection } from 'typeorm';

import {
  DB_CONNECTION_TOKEN,
  ROLE_REPOSITORY_TOKEN, SOCIALAUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../common/config/database.tokens.constants';

import { Role } from './role.entity';
import { SocialAuth } from './SocialAuth.entity';
import { User } from './user.entity';

export const usersProviders = [
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

export const socialAuthrovider = [
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: SOCIALAUTH_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): any => connection.getRepository(SocialAuth),
  },
];
