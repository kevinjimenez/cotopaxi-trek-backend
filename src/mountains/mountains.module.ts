import { Module } from '@nestjs/common';
import { MountainsService } from './mountains.service';
import { MountainsResolver } from './mountains.resolver';

@Module({
  providers: [MountainsResolver, MountainsService],
})
export class MountainsModule {}
