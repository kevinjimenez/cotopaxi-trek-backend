import { Module } from '@nestjs/common';
import { MountainsRepository } from './repositories/mountains.repository';
import { MountainsResolver } from './resolvers/mountains.resolver';
import { MountainsService } from './services/mountains.service';

@Module({
  providers: [MountainsResolver, MountainsService, MountainsRepository],
})
export class MountainsModule {}
