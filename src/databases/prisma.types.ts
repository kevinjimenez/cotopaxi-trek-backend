import { PrismaClient } from './generated/prisma/client';

export type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type ModelDelegate = {
  findUnique: (...args: any[]) => any;
  findMany: (...args: any[]) => any;
  create: (...args: any[]) => any;
  update: (...args: any[]) => any;
  delete: (...args: any[]) => any;
  count: (...args: any[]) => any;
};

export type ModelName = {
  [K in keyof PrismaTransaction]: PrismaTransaction[K] extends ModelDelegate
    ? K
    : never;
}[keyof PrismaTransaction];
