import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findMany();
  }

  findByUsernameWithCredential(username: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findFirst({
      where: {
        username,
      },
      include: {
        credentials: true,
      },
    });
  }

  findByIdWithCredential(id: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findUnique({
      where: {
        id,
      },
      include: {
        credentials: true,
      },
    });
  }

  create(payload: Prisma.UserCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.create({ data: payload });
  }
}
