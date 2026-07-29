import {
  ModelDelegate,
  ModelName,
  PrismaTransaction,
} from 'src/databases/prisma.types';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: PrismaTransaction,
    private readonly modelName: ModelName,
  ) {}

  findAll(tx?: PrismaTransaction): Promise<T[]> {
    const database = tx ?? this.db;
    const model = database[this.modelName] as ModelDelegate;

    return model.findMany() as Promise<T[]>;
  }

  findById(id: string | number, tx?: PrismaTransaction): Promise<T | null> {
    const database = tx ?? this.db;
    const model = database[this.modelName] as ModelDelegate;

    return model.findUnique({ where: { id } }) as Promise<T>;
  }

  create(data: unknown, tx?: PrismaTransaction): Promise<T> {
    const database = tx ?? this.db;
    const model = database[this.modelName] as ModelDelegate;

    return model.create({ data }) as Promise<T>;

    // try {
    // return await database[this.modelName].create({ data });
    // } catch (error) {
    //   return error;
    // }
  }
}
