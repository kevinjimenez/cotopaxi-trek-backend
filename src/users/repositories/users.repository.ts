import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class UsersRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findMany();
  }

  findByIdentifierWithCredential(identifier: string, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.findFirst({
      where: {
        OR: [
          {
            id: identifier,
          },
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

  update(id: string, payload: Prisma.UserUpdateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user.update({ where: { id }, data: payload });
  }
}
