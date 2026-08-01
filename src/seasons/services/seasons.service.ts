import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonInput } from '../dto/create-season.input';
import { UpdateSeasonInput } from '../dto/update-season.input';
import { SeasonMountainsRepository } from '../repositories/season-mountains.repository';
import { SeasonsRepository } from '../repositories/seasons.repository';

@Injectable()
export class SeasonsService {
  constructor(
    private readonly databasesService: DatabasesService,
    private readonly seasonsRepository: SeasonsRepository,
    private readonly seasonMountainsRepository: SeasonMountainsRepository,
  ) {}

  create(payload: CreateSeasonInput) {
    return this.databasesService.$transaction(async (tx) => {
      const { mountains, ...season } = payload;
      const createdSeason = await this.seasonsRepository.create(season, tx);

      const mountainsToCreate = mountains.map((mountain) => ({
        seasonId: createdSeason.id,
        ...mountain,
      }));

      await this.seasonMountainsRepository.createMany(mountainsToCreate);

      return createdSeason;
    });
  }

  findAll(tx?: PrismaTransaction) {
    return this.seasonsRepository.findAll(tx);
  }

  findAllWithMountains(tx?: PrismaTransaction) {
    return this.seasonsRepository.findAllWithMountains(tx);
  }

  update(payload: UpdateSeasonInput, tx?: PrismaTransaction) {
    const { id, ...data } = payload;
    return this.seasonsRepository.update(id, data, tx);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} season`;
  // }
}
