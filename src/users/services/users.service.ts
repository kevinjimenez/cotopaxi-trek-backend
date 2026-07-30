import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateCredentialInput } from '../dto/create-credential.input';
import { CreateUserInput } from '../dto/create-user.input';
import { UsersRepository } from '../repositories/users.repository';
import { CredentialsService } from './credentials.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly usersRepository: UsersRepository,
    private readonly credentialsService: CredentialsService,
  ) {}

  findAll(tx?: PrismaTransaction) {
    return this.usersRepository.findAll(tx);
  }

  create(payload: CreateUserInput) {
    const { password, ...user } = payload;

    return this.databasesService.$transaction(async (tx) => {
      const createdUser = await this.usersRepository.create(user, tx);

      const credential: CreateCredentialInput = {
        userId: createdUser.id,
        password: password,
      };
      await this.credentialsService.create(credential, tx);

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
