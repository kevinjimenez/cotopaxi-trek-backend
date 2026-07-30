import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';
import { PrismaTransaction } from 'src/databases/prisma.types';
import { CreateUserCredentialInput } from './dto/create-user-credential.input';

@Injectable()
export class UserCredentialsRepository {
  constructor(private readonly databasesService: DatabasesService) {}

  create(payload: CreateUserCredentialInput, tx?: PrismaTransaction) {
    const database = tx ?? this.databasesService;

    return database.user_credentials.create({ data: payload });
  }
}
