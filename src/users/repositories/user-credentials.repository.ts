import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UserCredentialsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  create(
    payload: Prisma.UserCredentialUncheckedCreateInput,
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.userCredential.create({ data: payload });
  }

  updateByUserId(
    userId: string,
    payload: Prisma.UserCredentialUncheckedUpdateInput,
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.userCredential.update({ where: { userId }, data: payload });
  }
}
