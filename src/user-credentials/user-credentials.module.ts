import { Module } from '@nestjs/common';
import { UserCredentialsRepository } from './user-credentials.repository';
import { UserCredentialsService } from './user-credentials.service';

@Module({
  providers: [UserCredentialsService, UserCredentialsRepository],
  exports: [UserCredentialsService],
})
export class UserCredentialsModule {}
