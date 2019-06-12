import { IConfig } from './config.interface';

export const databaseConfig: IConfig = {
  development: {
    DB_URL: 'DEV_DB_URL',
    ENTITIES: 'DEV_ENTITIES',
  },
  production: {
    DB_URL: 'PROD_DB_URL',
    ENTITIES: 'PROD_ENTITIES',
  },
  test: {
    DB_URL: 'TEST_DB_URL',
    ENTITIES: 'TEST_ENTITIES',
  },
};
