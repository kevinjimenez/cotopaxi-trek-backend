import { Module } from '@nestjs/common';
import { SeasonsRepository } from './repositories/seasons.repository';
import { SeasonMountainsResolver } from './resolvers/season-mountains.resolver';
import { SeasonsResolver } from './resolvers/seasons.resolver';
import { SeasonMountainsService } from './services/season-mountains.service';
import { SeasonsService } from './services/seasons.service';

@Module({
  providers: [
    SeasonsResolver,
    SeasonsService,
    SeasonsRepository,
    SeasonMountainsResolver,
    SeasonMountainsService,
  ],
})
export class SeasonsModule {}
