import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import express from 'express';
import { AgentsService } from './ai-providers/agents.service';
import * as requestType from './oauth/gaurd/request-type';
import { CacheProvider } from './cache/cache-provider';
import { assistant, user } from '@openai/agents';

type Model = 'GPT5' | 'GPT5mini';

interface TokenRates {
  input: number;
  output: number;
}

@Controller('ai')
export class AppController {
  TOKEN_PRICES: Record<Model, TokenRates> = {
    GPT5mini: { input: 0.00025, output: 0.002 },
    GPT5: { input: 0.00125, output: 0.01 },
  };

  constructor(
    private readonly agentsService: AgentsService,
    private readonly cacheProvider: CacheProvider,
  ) {}

  @Post('stream')
  async stream(
    @Req() req: requestType.RequestWithUser,
    @Body() body: { model: string; prompt: string },
    @Res() res: express.Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!this.TOKEN_PRICES[body.model])
      throw new Error(`Unknown model: ${body.model}`);

    const model = body.model as Model;
    const { input: inputRate, output: outputRate } = this.TOKEN_PRICES[model];

    try {
      await this.cacheProvider.addMessage(
        `${req.userId}_${body.model}`,
        user(body.prompt),
      );

      const history = await this.cacheProvider.getHistory(
        `${req.userId}_${body.model}`,
      );

      const stream = await this.agentsService.ask(body.model, history);

      /* const pass = new PassThrough();
      let finalOutput = '';
      pass.on('data', (chunk) => {
        finalOutput += chunk;
      });

      pass.pipe(res);
      (await stream)
        .toTextStream({
          compatibleWithNodeStreams: true,
        })
        .pipe(pass)
        .on('finish', (event) => {
          console.log(event);
        })
        .on('end', () => {
          void this.cacheProvider.addMessage(
            `${req.userId}_${body.model}`,
            assistant(finalOutput),
          );
        })
        .on('error', (err) => {
          console.log(err);
          res.end('Please try again..');
        });*/

      let usage: string;
      for await (const event of stream) {
        if (event.type === 'raw_model_stream_event') {
          if (event.data.type === 'output_text_delta') {
            res.write(event.data.delta);
          }

          if (event.data.type === 'response_done') {
            const cost =
              (event.data.response.usage.inputTokens / 1000) * inputRate +
              (event.data.response.usage.outputTokens / 1000) * outputRate;
            usage = `Total tokens : ${event.data.response.usage.totalTokens}, Cost : ${cost}`;
            res.write(`\n\n\n\n ###### **${usage}**`);
          }
        } else if (event.type === 'run_item_stream_event') {
          if (event.item.type === 'message_output_item') {
            await this.cacheProvider.addMessage(
              `${req.userId}_${body.model}`,
              assistant(`${event.item.content}`),
            );
            res.end();
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.end();
    }
  }
}
