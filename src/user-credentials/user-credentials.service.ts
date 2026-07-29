import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserCredentialInput } from './dto/create-user-credential.input';
import { UserCredentialsRepository } from './user-credentials.repository';

@Injectable()
export class UserCredentialsService {
  constructor(
    private readonly userCredentialsRepository: UserCredentialsRepository,
  ) {}

  create(payload: CreateUserCredentialInput, tx?: PrismaTransaction) {
    return this.userCredentialsRepository.create(payload, tx);
  }

  // findAll() {
  //   return `This action returns all userCredentials`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} userCredential`;
  // }

  // update(id: number, updateUserCredentialInput: UpdateUserCredentialInput) {
  //   return `This action updates a #${id} userCredential`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userCredential`;
  // }
}
