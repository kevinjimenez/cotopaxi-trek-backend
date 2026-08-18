import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { MountainParamsDto } from '../dto/mountain-params.dto';

@Injectable()
export class MountainsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll({ status }: MountainParamsDto = {}, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.mountain.findMany({
      where: { ...(status !== undefined && { status }) },
    });
  }

  create(payload: Prisma.MountainUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.mountain.create({ data: payload });
  }
}
