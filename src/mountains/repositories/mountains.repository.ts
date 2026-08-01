import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class MountainsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.mountain.findMany();
  }

  create(payload: Prisma.MountainUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.mountain.create({ data: payload });
  }

  update(
    id: number,
    payload: Prisma.MountainUncheckedUpdateInput,
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.mountain.update({ where: { id }, data: payload });
  }
}
