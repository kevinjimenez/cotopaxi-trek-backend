import { Injectable } from '@nestjs/common';
import { CreateSeasonMountainInput } from './dto/create-season-mountain.input';
import { UpdateSeasonMountainInput } from './dto/update-season-mountain.input';

@Injectable()
export class SeasonMountainsService {
  create(createSeasonMountainInput: CreateSeasonMountainInput) {
    return 'This action adds a new seasonMountain';
  }

  findAll() {
    return `This action returns all seasonMountains`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seasonMountain`;
  }

  update(id: number, updateSeasonMountainInput: UpdateSeasonMountainInput) {
    return `This action updates a #${id} seasonMountain`;
  }

  remove(id: number) {
    return `This action removes a #${id} seasonMountain`;
  }
}
