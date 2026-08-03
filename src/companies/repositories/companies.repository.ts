import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.company.findMany();
  }

  create(payload: Prisma.CompanyUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.company.create({ data: payload });
  }
}
