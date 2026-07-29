import { Injectable } from '@nestjs/common';
import { CreateUserCredentialInput } from './dto/create-user-credential.input';
import { UpdateUserCredentialInput } from './dto/update-user-credential.input';

@Injectable()
export class UserCredentialsService {
  create(createUserCredentialInput: CreateUserCredentialInput) {
    return 'This action adds a new userCredential';
  }

  findAll() {
    return `This action returns all userCredentials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCredential`;
  }

  update(id: number, updateUserCredentialInput: UpdateUserCredentialInput) {
    return `This action updates a #${id} userCredential`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCredential`;
  }
}
