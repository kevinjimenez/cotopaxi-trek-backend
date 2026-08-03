import { Injectable } from '@nestjs/common';
import { BookingsService } from 'src/bookings/services/bookings.service';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { AssignUserSeasonInput } from '../dto/assign-user-season.input';
import { CreateUserSeasonInput } from '../dto/create-user-season.input';
import { UserSeasonsRepository } from '../repositories/user-seasons.repository';

@Injectable()
export class UserSeasonsService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly userSeasonsRepository: UserSeasonsRepository,
    private readonly bookingsService: BookingsService,
  ) {}

  create(payload: CreateUserSeasonInput, tx?: PrismaTransaction) {
    return this.userSeasonsRepository.create(payload, tx);
  }

  findbyUserIdWithSeason(userId: string, tx?: PrismaTransaction) {
    return this.userSeasonsRepository.findbyUserIdWithSeason(userId, tx);
  }

  asisgn(payload: AssignUserSeasonInput) {
    const { bookings, ...seasonToAssign } = payload;
    const { userId } = seasonToAssign;

    return this.databasesService.$transaction(async (tx) => {
      await this.create(seasonToAssign, tx);

      const bookingsToCreate = bookings.map((booking) => ({
        ...booking,
        userId,
      }));

      await this.bookingsService.createMany(bookingsToCreate);
    });
  }
}
