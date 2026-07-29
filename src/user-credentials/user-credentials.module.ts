import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';
import { UserCredentialsResolver } from './user-credentials.resolver';

@Module({
  providers: [UserCredentialsResolver, UserCredentialsService],
})
export class UserCredentialsModule {}
