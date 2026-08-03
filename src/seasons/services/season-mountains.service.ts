import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonMountainInput } from '../dto/create-season-mountain.input';
import { SeasonMountainsRepository } from '../repositories/season-mountains.repository';

@Injectable()
export class SeasonMountainsService {
  constructor(
    private readonly seasonMountainsRepository: SeasonMountainsRepository,
  ) {}

  createMany(payload: CreateSeasonMountainInput[], tx?: PrismaTransaction) {
    return this.seasonMountainsRepository.createMany(payload, tx);
  }
}
