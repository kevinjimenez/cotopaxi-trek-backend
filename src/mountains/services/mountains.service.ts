import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateMountainInput } from '../dto/create-mountain.input';
import { MountainsRepository } from '../repositories/mountains.repository';

@Injectable()
export class MountainsService {
  constructor(private readonly mountainsRepository: MountainsRepository) {}

  create(payload: CreateMountainInput, tx?: PrismaTransaction) {
    return this.mountainsRepository.create(payload, tx);
  }

  findAll(tx?: PrismaTransaction) {
    return this.mountainsRepository.findAll(tx);
  }
}
