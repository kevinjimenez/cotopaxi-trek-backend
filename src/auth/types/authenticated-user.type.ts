import { Prisma } from 'src/databases/generated/prisma/client';

export type AuthenticatedUser = Prisma.UserGetPayload<{
  include: { credentials: true };
}>;
