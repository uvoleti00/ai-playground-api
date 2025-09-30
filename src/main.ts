import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: 'https://ai-playground-ui-cyan.vercel.app',
    methods: 'GET,POST',
  });
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0.0');
}
bootstrap();
