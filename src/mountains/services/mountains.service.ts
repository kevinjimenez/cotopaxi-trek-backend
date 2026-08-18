import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateMountainInput } from '../dto/create-mountain.input';
import { MountainsRepository } from '../repositories/mountains.repository';
import { MountainParamsDto } from '../dto/mountain-params.dto';

@Injectable()
export class MountainsService {
  constructor(private readonly mountainsRepository: MountainsRepository) {}

  create(payload: CreateMountainInput, tx?: PrismaTransaction) {
    return this.mountainsRepository.create(payload, tx);
  }

  findAll(params: MountainParamsDto, tx?: PrismaTransaction) {
    return this.mountainsRepository.findAll(params, tx);
  }
}
