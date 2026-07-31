import { Module } from '@nestjs/common';
import { SeasonsRepository } from './repositories/seasons.repository';
import { SeasonsResolver } from './resolvers/seasons.resolver';
import { SeasonsService } from './services/seasons.service';

@Module({
  providers: [SeasonsResolver, SeasonsService, SeasonsRepository],
})
export class SeasonsModule {}
