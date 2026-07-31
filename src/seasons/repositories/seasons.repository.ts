import { Injectable } from '@nestjs/common';
import { DatabasesService } from 'src/databases/databases.service';

@Injectable()
export class SeasonsRepository {
  constructor(private readonly databasesService: DatabasesService) {}
}
