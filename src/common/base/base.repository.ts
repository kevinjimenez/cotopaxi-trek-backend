/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient } from 'src/databases/generated/prisma/client';

type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: PrismaTransaction,
    private readonly modelName: string,
  ) {}

  findAll(tx?: PrismaTransaction): Promise<T[]> {
    const database = tx ?? this.db;

    return database[this.modelName].findMany();
  }

  async create(data: unknown, tx?: PrismaTransaction): Promise<T> {
    const database = tx ?? this.db;

    // try {
    return await database[this.modelName].create({ data });
    // } catch (error) {
    //   return error;
    // }
  }
}
