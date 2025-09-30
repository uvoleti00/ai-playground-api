import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsService } from './ai-providers/agents.service';
import { GPT5Service } from './ai-providers/gtp5.service';
import { GPT5MiniService } from './ai-providers/gtp5.mini.service';
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
    AppService,
    GPT5Service,
    GPT5MiniService,
    AgentsService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    CacheProvider,
  ],
})
export class AppModule {}
