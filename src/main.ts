import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app.module';
import { envs } from './common/config/envs';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  await app.listen(envs.port);
  logger.log(`Environment: ${envs.nodeEnv}`);
  logger.log(`Server running on: ${await app.getUrl()}`);
}
void bootstrap();
