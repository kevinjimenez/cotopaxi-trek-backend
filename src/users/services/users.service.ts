import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserCredentialInput } from '../dto/create-user-credential.input';
import { CreateUserInput } from '../dto/create-user.input';
import { UsersRepository } from '../repositories/users.repository';
import { UserCredentialsService } from './user-credentials.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly usersRepository: UsersRepository,
    private readonly uUserCredentialsService: UserCredentialsService,
  ) {}

  findAll(tx?: PrismaTransaction) {
    return this.usersRepository.findAll(tx);
  }

  create(payload: CreateUserInput) {
    const { password, ...user } = payload;

    return this.databasesService.$transaction(async (tx) => {
      const createdUser = await this.usersRepository.create(user, tx);

      const credential: CreateUserCredentialInput = {
        userId: createdUser.id,
        password: password,
      };
      await this.uUserCredentialsService.create(credential, tx);

      return createdUser;
    });
  }

  findByIdWithCredential(id: string) {
    return this.usersRepository.findByIdWithCredential(id);
  }

  findByUsernameWithCredential(username: string) {
    return this.usersRepository.findByUsernameWithCredential(username);
  }
}
