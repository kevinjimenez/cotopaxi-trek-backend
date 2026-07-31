import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateSeasonInput } from '../dto/create-season.input';
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

  // findOne(id: number) {
  //   return `This action returns a #${id} season`;
  // }

  // update(id: number, updateSeasonInput: UpdateSeasonInput) {
  //   return `This action updates a #${id} season`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} season`;
  // }
}
