import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserCredentialInput } from 'src/user-credentials/dto/create-user-credential.input';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { CreateUserInput } from './dto/create-user.input';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly usersRepository: UsersRepository,
    private readonly userCredentialsService: UserCredentialsService,
  ) {}

  findAll(tx?: PrismaTransaction) {
    return this.usersRepository.findAll(tx);
  }

  create(payload: CreateUserInput) {
    const { password, ...user } = payload;

    return this.databasesService.$transaction(async (tx) => {
      const createdUser = await this.usersRepository.create(user, tx);

      const credential: CreateUserCredentialInput = {
        user_id: createdUser.id,
        password: password,
      };
      await this.userCredentialsService.create(credential, tx);

      return createdUser;
    });
  }

  findByIdWithCredential(id: string) {
    return this.usersRepository.findByIdWithCredential(id);
  }
}
