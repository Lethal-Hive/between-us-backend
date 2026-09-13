import { Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './redis-connection';

@Module({
  imports: [CacheModule.registerAsync(RedisOptions)],
  controllers: [],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
