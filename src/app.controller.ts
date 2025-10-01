import { Controller, Post, Body, Res, Req, Get, Param } from '@nestjs/common';
import express from 'express';
import { AgentProvider } from './ai/agents.provider';
import * as requestType from './oauth/gaurd/request-type';
import { CacheProvider, ChatMessage } from './cache/cache-provider';
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
    private readonly agentsService: AgentProvider,
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newArr = history.map(({ providerData, ...rest }) => rest);

      const stream = await this.agentsService.ask(body.model, newArr);

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

      let usage: string = '';
      for await (const event of stream) {
        if (event.type === 'raw_model_stream_event') {
          if (event.data.type === 'output_text_delta') {
            res.write(event.data.delta);
          }

          if (event.data.type === 'response_done') {
            const cost: number =
              (event.data.response.usage.inputTokens / 1000) * inputRate +
              (event.data.response.usage.outputTokens / 1000) * outputRate;

            let finalPrice: string;

            if (cost < 0.001) finalPrice = cost.toFixed(6);
            else if (cost < 1) finalPrice = cost.toFixed(4);
            else finalPrice = cost.toFixed(2);
            usage = `Total tokens : ${event.data.response.usage.totalTokens}, Cost : ${finalPrice}`;
            res.write(`\n\n\n\n ###### **${usage}**`);
          }
        } else if (event.type === 'run_item_stream_event') {
          if (event.item.type === 'message_output_item') {
            await this.cacheProvider.addMessage(
              `${req.userId}_${body.model}`,
              assistant(`${event.item.content}`, { Metrics: usage }),
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

  @Get('history/:model')
  async fetchConversation(
    @Req() req: requestType.RequestWithUser,
    @Param() model: string,
  ): Promise<ChatMessage[]> {
    return await this.cacheProvider.getHistory(`${req.userId}_${model}`);
  }

  @Get('/newChat')
  async clearHistory(@Req() req: requestType.RequestWithUser) {
    return await this.cacheProvider.clearHistory(req.userId);
  }
}
