import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import * as os from 'os';
export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: false,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: os.platform() === 'win32' ? '127.0.0.1' : 'localhost',
        port: parseInt(
          configService.get<string>('app')?.['redisPort'] ?? '6379',
        ),
      },
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
