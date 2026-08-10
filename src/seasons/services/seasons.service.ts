import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonInput } from '../dto/create-season.input';
import { SeasonsRepository } from '../repositories/seasons.repository';
import { SeasonMountainsService } from './season-mountains.service';

@Injectable()
export class SeasonsService {
  constructor(
    private readonly seasonsRepository: SeasonsRepository,
    private readonly databasesService: DatabasesService,
    private readonly seasonMountainsService: SeasonMountainsService,
  ) {}

  create(payload: CreateSeasonInput) {
    return this.databasesService.$transaction(async (tx) => {
      const { mountains, ...season } = payload;
      const createdSeason = await this.seasonsRepository.create(season, tx);

      const mountainsToCreate = mountains.map((mountain) => ({
        seasonId: createdSeason.id,
        ...mountain,
      }));

      await this.seasonMountainsService.createMany(mountainsToCreate);

      return createdSeason;
    });
  }

  findAllWithMountains(params: QueryParamsDto, tx?: PrismaTransaction) {
    return this.seasonsRepository.findAllWithMountains(params, tx);
  }

  findOne(params: QueryParamsDto, tx?: PrismaTransaction) {
    return this.seasonsRepository.findOne(params, tx);
  }
}
