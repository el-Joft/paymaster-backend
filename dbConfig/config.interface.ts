export interface IConfig {
  development: {
    DB_URL: string;
    ENTITIES: string;
  };
  production: {
    DB_URL: string;
    ENTITIES: string;
  };
  test: {
    DB_URL: string;
    ENTITIES: string;
  };
  [key: string]: {
    DB_URL: string;
    ENTITIES: string;
  };
}
