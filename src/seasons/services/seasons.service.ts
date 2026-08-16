import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from 'src/common/dtos/query-params.dto';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonInput } from '../dto/create-season.input';
import { SeasonParamsDto } from '../dto/season-params.dto';
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
      return this.createWithMountain(payload, tx);
    });
  }

  findAllWithMountains(params: QueryParamsDto, tx?: PrismaTransaction) {
    return this.seasonsRepository.findAllWithMountains(params, tx);
  }

  findOneById(params: SeasonParamsDto, tx?: PrismaTransaction) {
    return this.seasonsRepository.findOneById(params, tx);
  }

  private async createWithMountain(
    payload: CreateSeasonInput,
    tx: PrismaTransaction,
  ) {
    const { mountains, ...season } = payload;
    const createdSeason = await this.seasonsRepository.create(season, tx);

    const mountainsToCreate = mountains.map((mountain) => ({
      seasonId: createdSeason.id,
      ...mountain,
    }));

    await this.seasonMountainsService.createMany(mountainsToCreate, tx);

    // TODO: revisar si aun deberia ir si no comnetar o quitar
    // return this.seasonsRepository.findByIdWithMountains(createdSeason.id, tx);
    return createdSeason;
  }
}
