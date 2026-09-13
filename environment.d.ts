import { APP_ENVIRONMENT } from 'src/constants/app.enum.constant';

declare namespace NodeJS {
  interface ProcessEnv {
    // APP CONFIG
    APP_NAME: string;
    APP_NODE_ENV: APP_ENVIRONMENT;
    APP_LANGUAGE: string;
    APP_TIMEZONE: string;

    CORS_ENABLE: boolean;
    CORS_ORIGINS: string[];

    // PORT
    PORT: number;
    // API VERSIONING
    API_PREFIX: string;
    API_VERSION: number;

    // DATABASE CONFIG
    DATABASE_URI: string;
    DATABASE_DEBUG: boolean;
  }
}
