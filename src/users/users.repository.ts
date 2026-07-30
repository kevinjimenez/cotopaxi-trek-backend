import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.users.findMany();
  }

  findByIdWithCredential(id: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.users.findUnique({
      where: {
        id,
      },
      include: {
        credentials: true,
      },
    });
  }

  create(payload: Prisma.usersCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.users.create({ data: payload });
  }
}
