import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserSeasonInput } from '../dto/create-user-season.input';
import { UserSeasonsRepository } from '../repositories/user-seasons.repository';

@Injectable()
export class UserSeasonsService {
  constructor(private readonly userSeasonsRepository: UserSeasonsRepository) {}

  create(payload: CreateUserSeasonInput) {
    return this.userSeasonsRepository.create(payload);
  }

  findAll(tx?: PrismaTransaction) {
    return this.userSeasonsRepository.findAll(tx);
  }
}
