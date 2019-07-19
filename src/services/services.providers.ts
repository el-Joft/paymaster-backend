import { Connection } from 'typeorm';

import {
  DB_CONNECTION_TOKEN,
  SERVICES_REPOSITORY_TOKEN, SERVICESCATEGORY_REPOSITORY_TOKEN,
} from '../common/config/database.tokens.constants';

import { ServiceCategoryEntity } from './serviceCategory.entity';
import { ServicesEntity } from './services.entity';

export const serviceProviders = [
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: SERVICESCATEGORY_REPOSITORY_TOKEN,
    useFactory: (
      connection: Connection): any => connection.getRepository(
        ServiceCategoryEntity),
  },
  {
    inject: [DB_CONNECTION_TOKEN],
    provide: SERVICES_REPOSITORY_TOKEN,
    useFactory: (connection: Connection): any => connection.getRepository(ServicesEntity),
  },
];
