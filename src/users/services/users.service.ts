import { Injectable } from '@nestjs/common';
import { BookingsService } from 'src/bookings/services/bookings.service';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UsersRepository } from '../repositories/users.repository';
import { UserCredentialsService } from './user-credentials.service';
import { UserSeasonsService } from './user-seasons.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly usersRepository: UsersRepository,
    private readonly userCredentialsService: UserCredentialsService,
    private readonly userSeasonsService: UserSeasonsService,
    private readonly bookingsService: BookingsService,
  ) {}

  findAll(tx?: PrismaTransaction) {
    return this.usersRepository.findAll(tx);
  }

  findAllWithSeasons(tx?: PrismaTransaction) {
    return this.usersRepository.findAllWithSeasons(tx);
  }

  create(payload: CreateUserInput) {
    const { seasonId, bookings, password, ...user } = payload;

    return this.databasesService.$transaction(async (tx) => {
      const createdUser = await this.usersRepository.create(user, tx);

      const credentialToCreate = {
        userId: createdUser.id,
        password: password,
      };
      await this.userCredentialsService.create(credentialToCreate, tx);

      const seasonToCreate = {
        userId: createdUser.id,
        seasonId,
      };
      await this.userSeasonsService.create(seasonToCreate, tx);

      const bookingsToCreate = bookings.map((booking) => ({
        ...booking,
        userId: createdUser.id,
      }));

      await this.bookingsService.createMany(bookingsToCreate, tx);

      return createdUser;
    });
  }

  update(payload: UpdateUserInput) {
    // const { id, ...user } = payload;

    // return this.usersRepository.update(id, user);
    return this.usersRepository.findAll();
  }

  findByIdWithCredential(id: string) {
    return this.usersRepository.findByIdWithCredential(id);
  }

  findByUsernameWithCredential(username: string) {
    return this.usersRepository.findByUsernameWithCredential(username);
  }
}
