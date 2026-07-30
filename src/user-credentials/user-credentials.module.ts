import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserCredentialsRepository } from './user-credentials.repository';
import { UserCredentialsService } from './user-credentials.service';

@Module({
  imports: [CommonModule],
  providers: [UserCredentialsService, UserCredentialsRepository],
  exports: [UserCredentialsService],
})
export class UserCredentialsModule {}
