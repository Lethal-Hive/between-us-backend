import { registerAs } from '@nestjs/config';
import { APP_ENVIRONMENT } from 'src/constants/app.constants';
export type databaseEnv = {
  uri: string;
  debug: boolean;
  timeoutOptions: {
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    heartbeatFrequencyMS: number;
  };
};

export const databaseConfigRegistration = registerAs(
  'database',
  (): Record<string, any> => ({
    uri: process.env.DATABASE_URI ?? 'mongodb://localhost:27017',
    debug: process.env.APP_NODE_ENV !== APP_ENVIRONMENT.PRODUCTION,
    timeoutOptions: {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      heartbeatFrequencyMS: 30000,
    },
  }),
);
