import { Injectable } from '@nestjs/common';
import { CreateMountainInput } from './dto/create-mountain.input';
import { UpdateMountainInput } from './dto/update-mountain.input';

@Injectable()
export class MountainsService {
  create(createMountainInput: CreateMountainInput) {
    return 'This action adds a new mountain';
  }

  findAll() {
    return `This action returns all mountains`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mountain`;
  }

  update(id: number, updateMountainInput: UpdateMountainInput) {
    return `This action updates a #${id} mountain`;
  }

  remove(id: number) {
    return `This action removes a #${id} mountain`;
  }
}
