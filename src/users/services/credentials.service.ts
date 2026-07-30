import { Injectable } from '@nestjs/common';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateCredentialInput } from '../dto/create-credential.input';
import { CredentialsRepository } from '../repositories/credentials.repository';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly userCredentialsRepository: CredentialsRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}

  create(payload: CreateCredentialInput, tx?: PrismaTransaction) {
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
