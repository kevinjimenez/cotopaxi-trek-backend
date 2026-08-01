import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonInput } from '../dto/create-season.input';
import { UpdateSeasonInput } from '../dto/update-season.input';
import { SeasonsRepository } from '../repositories/seasons.repository';

@Injectable()
export class SeasonsService {
  constructor(private readonly seasonsRepository: SeasonsRepository) {}

  create(payload: CreateSeasonInput) {
    return this.seasonsRepository.create(payload);
  }

  findAll(tx?: PrismaTransaction) {
    return this.seasonsRepository.findAll(tx);
  }

  update(payload: UpdateSeasonInput, tx?: PrismaTransaction) {
    const { id, ...data } = payload;
    return this.seasonsRepository.update(id, data, tx);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} season`;
  // }
}
