import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';
import { PrismaTransaction } from 'src/databases/prisma.types';

@Injectable()
export class BookingsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  findAll(tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.booking.findMany();
  }

  create(payload: Prisma.BookingUncheckedCreateInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.booking.create({ data: payload });
  }
}
