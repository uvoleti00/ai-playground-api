import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AgentProvider } from './ai/agents.provider';
import { GPT5Provider } from './ai/gtp5.provider';
import { GPT5MiniProvider } from './ai/gtp5.mini.provider';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ClerkClientProvider } from './oauth/gaurd/clerk-provider';
import { AuthGuard } from './oauth/gaurd/auth-gaurd';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheProvider } from './cache/cache-provider';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 1800 }),
  ],
  controllers: [AppController],
  providers: [
    GPT5Provider,
    GPT5MiniProvider,
    AgentProvider,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    CacheProvider,
  ],
})
export class AppModule {}
