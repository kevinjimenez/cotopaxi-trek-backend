import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  // create(createUserInput: CreateUserInput) {
  //   return 'This action adds a new user';
  // }

  findAll() {
    return this.userRepository.findAll();
  }

  create(payload: CreateUserInput) {
    return this.userRepository.create(payload);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
