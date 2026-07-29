import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService, UserRepository],
})
export class UsersModule {}
