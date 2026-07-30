import { Module } from '@nestjs/common';
import { UserCredentialsModule } from 'src/user-credentials/user-credentials.module';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [UserCredentialsModule],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
