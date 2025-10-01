import { Injectable } from '@nestjs/common';
import { Agent } from '@openai/agents';
import { AIService } from './agent';

@Injectable()
export class GPT5Provider extends AIService {
  // Human-readable model identifier used for logging/config selection.
  modelName = 'GPT5';

  constructor() {
    super(
      new Agent({
        name: 'GPT-5',
        model: 'gpt-5',
        instructions:
          'You are an online agent. Answer queries politely and concisely.',
      }),
    );
  }
}
