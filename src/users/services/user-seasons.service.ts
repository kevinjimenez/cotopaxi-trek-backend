import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserSeasonInput } from '../dto/create-user-season.input';
import { UserSeasonsRepository } from '../repositories/user-seasons.repository';

@Injectable()
export class UserSeasonsService {
  constructor(private readonly userSeasonsRepository: UserSeasonsRepository) {}

  create(payload: CreateUserSeasonInput, tx?: PrismaTransaction) {
    return this.userSeasonsRepository.create(payload, tx);
  }

  findAll(tx?: PrismaTransaction) {
    return this.userSeasonsRepository.findAll(tx);
  }
}
