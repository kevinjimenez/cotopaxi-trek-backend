import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class SeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAllWithMountains(isCurrent?: boolean, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findMany({
      where: isCurrent === undefined ? undefined : { isCurrent },
      include: {
        seasonMountains: {
          include: {
            mountain: true,
          },
        },
      },
    });
  }

  findCurrent(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findFirst({
      where: { isCurrent: true },
      include: {
        seasonMountains: {
          include: {
            mountain: true,
          },
        },
      },
    });
  }

  create(payload: Prisma.SeasonUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.create({ data: payload });
  }
}
