import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AssistantMessageItem, UserMessageItem } from '@openai/agents';

export type ChatMessage = UserMessageItem | AssistantMessageItem;

@Injectable()
export class CacheProvider {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addMessage(id: string, message: ChatMessage) {
    const history = (await this.cacheManager.get<ChatMessage[]>(id)) || [];
    history.push(message);
    await this.cacheManager.set(id, history, 0);
  }

  async getHistory(id: string): Promise<ChatMessage[]> {
    const history: ChatMessage[] =
      (await this.cacheManager.get<ChatMessage[]>(id)) ?? [];

    if (history.length) {
      await this.cacheManager.set(id, history, 0);
    }

    return history;
  }
}
