import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class SeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findMany();
  }

  create(payload: Prisma.SeasonUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.create({ data: payload });
  }
}
