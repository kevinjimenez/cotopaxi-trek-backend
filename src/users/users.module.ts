import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserCredentialsRepository } from './repositories/user-credentials.repository';
import { UserSeasonsRepository } from './repositories/user-seasons.repository';
import { UsersRepository } from './repositories/users.repository';
import { UserSeasonsResolver } from './resolvers/user-seasons.resolver';
import { UsersResolver } from './resolvers/users.resolver';
import { UserCredentialsService } from './services/user-credentials.service';
import { UserSeasonsService } from './services/user-seasons.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [CommonModule],
  providers: [
    UsersResolver,
    UsersService,
    UsersRepository,
    UserCredentialsService,
    UserCredentialsRepository,
    UserSeasonsResolver,
    UserSeasonsService,
    UserSeasonsRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
