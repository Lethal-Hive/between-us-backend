import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  //ttl in seconds
  set(key: string, value: any, ttl: number) {
    return this.cacheManager.set(key, value, { ttl } as any);
  }

  get(key: string) {
    return this.cacheManager.get(key);
  }

  clear() {
    return this.cacheManager.clear();
  }

  delete(key: string) {
    return this.cacheManager.del(key);
  }
}
