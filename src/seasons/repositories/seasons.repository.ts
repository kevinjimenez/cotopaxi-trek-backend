import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { SeasonParamsDto } from '../dto/season-params.dto';

@Injectable()
export class SeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAllWithMountains(
    { status }: QueryParamsDto = {},
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.season.findMany({
      where: { ...(status !== undefined && { isCurrent: status }) },
      include: {
        seasonMountains: {
          include: {
            mountain: true,
          },
        },
      },
    });
  }

  findOneById({ id, status }: SeasonParamsDto = {}, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.findFirst({
      where: {
        ...(id !== undefined && { id }),
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

  // findByIdWithMountains(id: number, tx?: PrismaTransaction) {
  //   const database = tx ?? this.databasesService;

  //   return database.season.findUniqueOrThrow({
  //     where: { id },
  //     include: {
  //       seasonMountains: {
  //         include: {
  //           mountain: true,
  //         },
  //       },
  //     },
  //   });
  // }

  create(payload: Prisma.SeasonUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.season.create({ data: payload });
  }
}
