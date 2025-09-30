import { Agent, StreamedRunResult, run } from '@openai/agents';
import { ChatMessage } from 'src/cache/cache-provider';

/**
 * AIService defines the minimal contract for AI model integrations used by the
 * application. Implementations should provide a human-readable modelName and
 * an async run(...) method that accepts a text prompt and returns the model's
 * text response.
 */
export abstract class AIService {
  /**
   * Short identifier for the model implementation (e.g. "gpt-5", "gpt-5-mini").
   */
  abstract modelName: string;
  protected agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }
  /**
   * Run the agent with the provided prompt.
   *
   * @param prompt - Input text to send to the agent.
   * @returns Promise resolving to a StreamedRunResult which yields intermediate
   *          streaming chunks as the model produces output. Consumers should
   *          handle the streaming semantics (subscribe/iterate) or await final
   *          output if the helper provides one.
   *
   * Implementation detail: we enable stream: true to receive streamed results.
   * If you need a non-streaming Promise<string>, aggregate the stream here and
   * return the concatenated text instead.
   */
  async run(
    prompt: ChatMessage[],
  ): Promise<StreamedRunResult<undefined, Agent<any, any>>> {
    // Delegate to the agent runner with streaming enabled.
    return await run(this.agent, prompt, {
      stream: true,
    }).catch((err) => {
      console.log('Error from Open AI ' + err);
      throw err;
    });
  }
}
