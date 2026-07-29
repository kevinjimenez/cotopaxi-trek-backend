import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/base.repository';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { CreateUserCredentialInput } from 'src/user-credentials/dto/create-user-credential.input';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UsersRepository extends BaseRepository<Prisma.usersModel> {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly userCredentialsService: UserCredentialsService,
  ) {
    super(databasesService, 'users');
  }

  createOne(payload: CreateUserInput) {
    return this.databasesService.$transaction(async (tx) => {
      const createdUser = await this.create(payload, tx);

      const credential: CreateUserCredentialInput = {
        user_id: createdUser.id,
        password: payload.password,
      };
      await this.userCredentialsService.create(credential, tx);

      return createdUser;
    });
  }

  findOne(id: string) {
    return this.databasesService.users.findUnique({
      where: {
        id,
      },
      include: {
        credentials: true,
      },
    });
  }
}
