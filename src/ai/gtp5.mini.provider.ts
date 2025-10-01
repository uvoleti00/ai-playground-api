import { Injectable } from '@nestjs/common';
import { Agent } from '@openai/agents';
import { AIService } from './agent';

@Injectable()
export class GPT5MiniProvider extends AIService {
  // Human-readable model identifier used for logging/config selection.
  modelName = 'GPT5mini';

  constructor() {
    super(
      new Agent({
        name: 'GPT-5-mini',
        model: 'gpt-5-mini',
        instructions:
          'You are an online agent. Answer queries politely and concisely.',
      }),
    );
  }
}
