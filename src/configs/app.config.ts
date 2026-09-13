import { registerAs } from '@nestjs/config';
import { APP_ENVIRONMENT, APP_TIMEZONE } from 'src/constants/app.constants';
export type appEnv = {
  name: string;
  env: APP_ENVIRONMENT;
  timezone: APP_TIMEZONE;
  language: string;
  debug: boolean;
  port: number;
  socketPort: number;
  redisPort: number;
  swagger: {
    name: string;
    tabName: string;
    version: string;
    secondServer: string;
    route: string;
    username: string;
    password: string;
    useDocumentation: string;
  };
  urlVersion: {
    prefix: string;
    version: string;
  };
  cors: {
    enabled: boolean;
    origins: string[];
  };
  jwt: {
    user: {
      secret: string;
      accessTokenExpiration: string;
    };
    staff: {
      secret: string;
      accessTokenExpiration: string;
    };
  };
};

export const appConfigRegistration = registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'SPECTRE TEAM NESTJS BOILERPLATE',

    env: process.env.APP_NODE_ENV ?? APP_ENVIRONMENT.DEVELOPMENT,

    timezone: process.env.APP_TIMEZONE ?? APP_TIMEZONE.AFRICA_CAIRO,

    language: process.env.APP_LANGUAGE ?? 'en',

    debug: process.env.APP_NODE_ENV !== APP_ENVIRONMENT.PRODUCTION,

    port: process.env.APP_PORT ?? 3000,

    socketPort: process.env.SOCKET_PORT ?? 3001,

    redisPort: process.env.REDIS_PORT ?? 6379,

    swagger: {
      name: process.env.SWAGGER_API_NAME ?? 'SPECTRE TEAM NESTJS BOILERPLATE',
      tabName: process.env.SWAGGER_API_TAB_NAME ?? 'Lethal Hive Swagger',
      version: process.env.SWAGGER_API_VERSION ?? '1.0',
      secondServer: process.env.SWAGGER_API_SECOND_SERVER_URL ?? '',
      route: process.env.SWAGGER_API_ROUTE ?? '/api-docs',
      username: process.env.SWAGGER_AUTH_USERNAME ?? '',
      password: process.env.SWAGGER_AUTH_PASSWORD ?? '',
      useDocumentation: process.env.USE_DOCUMENTATION,
    },

    urlVersion: {
      prefix: process.env.API_PREFIX ?? 'v',
      version: process.env.API_VERSION ?? '1',
    },

    cors: {
      enabled: process.env.CORS_ENABLED === 'true',
      origins: process.env.CORS_ALLOWED_ORIGINS ?? [],
    },

    jwt: {
      user: {
        secret: process.env.USER_AUTH_JWT_SECRET ?? '',
        accessTokenExpiration:
          process.env.USER_AUTH_JWT_ACCESS_TOKEN_EXPIRATION ?? '1d',
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? '',
        clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
        clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET ?? '',
      },
      staff: {
        secret: process.env.STAFF_AUTH_JWT_SECRET ?? '',
        accessTokenExpiration:
          process.env.STAFF_AUTH_JWT_ACCESS_TOKEN_EXPIRATION ?? '1d',
      },
    },
  }),
);
