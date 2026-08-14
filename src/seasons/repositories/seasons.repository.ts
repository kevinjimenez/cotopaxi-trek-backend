import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class SeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAllWithMountains(
    { status }: QueryParamsDto = {},
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.season.findMany({
      where: {
        ...(status !== undefined && { isCurrent: status }),
      },
      include: {
        seasonMountains: {
          include: {
            mountain: true,
          },
        },
      },
    });
  }

  findOne({ status }: QueryParamsDto = {}, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findFirst({
      where: {
        ...(status !== undefined && { isCurrent: status }),
      },
      include: {
        seasonMountains: {
          include: {
            mountain: true,
          },
        },
      },
    });
  }

  findByIdWithMountains(id: number, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findUniqueOrThrow({
      where: { id },
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
