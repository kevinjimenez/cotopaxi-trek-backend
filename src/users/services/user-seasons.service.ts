import { Injectable } from '@nestjs/common';
import { CreateUserSeasonInput } from './dto/create-user-season.input';
import { UpdateUserSeasonInput } from './dto/update-user-season.input';

@Injectable()
export class UserSeasonsService {
  create(createUserSeasonInput: CreateUserSeasonInput) {
    return 'This action adds a new userSeason';
  }

  findAll() {
    return `This action returns all userSeasons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSeason`;
  }

  update(id: number, updateUserSeasonInput: UpdateUserSeasonInput) {
    return `This action updates a #${id} userSeason`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSeason`;
  }
}
