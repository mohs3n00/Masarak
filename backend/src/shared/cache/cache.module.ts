import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('cache.host');
        const port = configService.get<number>('cache.port');
        const password = configService.get<string>('cache.password');

        let store;
        try {
          store = await redisStore({
            socket: {
              host,
              port,
            },
            password: password || undefined,
          });
        } catch {
          // Fallback to memory store if redis fails to init config
          store = 'memory';
        }

        return {
          store: store,
          ttl: 60000, // 60 seconds default
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class GlobalCacheModule {}
