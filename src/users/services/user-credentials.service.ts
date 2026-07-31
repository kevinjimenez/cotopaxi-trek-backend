import { Injectable } from '@nestjs/common';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserCredentialInput } from '../dto/create-user-credential.input';
import { UserCredentialsRepository } from '../repositories/user-credentials.repository';

@Injectable()
export class UserCredentialsService {
  constructor(
    private readonly userCredentialsRepository: UserCredentialsRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}

  create(payload: CreateUserCredentialInput, tx?: PrismaTransaction) {
    const { password, userId } = payload;
    const hash = this.bcryptAdapter.hash(password);
    const toCreate = { userId, password: hash };
    return this.userCredentialsRepository.create(toCreate, tx);
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
