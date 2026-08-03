import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UserSeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findbyUserIdWithSeason(userId: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.userSeason.findFirst({
      where: {
        userId,
      },
      include: {
        season: {
          include: {
            seasonMountains: {
              include: {
                season: true,
                mountain: true,
                bookings: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });
  }

  create(
    payload: Prisma.UserSeasonUncheckedCreateInput,
    tx?: PrismaTransaction,
  ) {
    const database = tx ?? this.databasesService;

    return database.userSeason.create({ data: payload });
  }
}
