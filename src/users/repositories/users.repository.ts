import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findByIdentifierWithCredential(identifier: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findFirst({
      where: {
        OR: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
      },
      include: {
        credentials: true,
      },
    });
  }

  findAllWithSeasons(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findMany({
      include: {
        bookings: {
          include: {
            seasonMountain: {
              include: {
                season: true,
                mountain: true,
              },
            },
          },
        },
        userSeasons: {
          include: {
            season: {
              include: {
                seasonMountains: {
                  include: {
                    mountain: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findByIdWithSeasons(id: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findUniqueOrThrow({
      where: { id },
      include: {
        bookings: {
          include: {
            seasonMountain: {
              include: {
                season: true,
                mountain: true,
              },
            },
          },
        },
        userSeasons: {
          include: {
            season: {
              include: {
                seasonMountains: {
                  include: {
                    mountain: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  create(payload: Prisma.UserCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.create({ data: payload });
  }
}
