import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { AIService } from './ai.provider.interface';
import { Agent, StreamedRunResult } from '@openai/agents';
import { ChatMessage } from 'src/cache/cache-provider';

@Injectable()
export class AgentsService implements OnModuleInit {
  private agentsMap: Record<string, AIService> = {};

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      if (!wrapper.instance) continue;

      // check if it implements AIService
      if (wrapper.instance instanceof AIService) {
        this.agentsMap[wrapper.instance.modelName] = wrapper.instance;
      }
    }
  }

  getAgent(modelName: string): AIService {
    const agent = this.agentsMap[modelName];
    if (!agent) throw new Error(`Agent ${modelName} not found`);
    return agent;
  }

  async ask(
    modelName: string,
    prompt: ChatMessage[],
  ): Promise<StreamedRunResult<undefined, Agent<any, any>>> {
    const agent = this.getAgent(modelName);
    return agent.run(prompt);
  }
}
