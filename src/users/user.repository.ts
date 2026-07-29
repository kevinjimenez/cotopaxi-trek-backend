import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/base.repository';
import { DatabasesService } from 'src/databases/databases.service';
import { Prisma } from 'src/databases/generated/prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<Prisma.usersModel> {
  constructor(private readonly databasesService: DatabasesService) {
    super(databasesService, 'users');
  }
}
