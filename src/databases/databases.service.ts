import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { envs } from 'src/common/config/envs';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class DatabasesService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabasesService.name);

  constructor() {
    const ssl =
      envs.nodeEnv !== 'local' ? { rejectUnauthorized: false } : undefined;

    const newAdapter = new PrismaPg({
      connectionString: envs.databaseUrl,
      ssl,
    });

    super({ adapter: newAdapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error('Database connected failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Database:', error);
    }
  }
}
