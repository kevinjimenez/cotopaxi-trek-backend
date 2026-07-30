import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { AuthenticatedUser } from '../types/authenticated-user.type';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export const CurrentUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    console.log(_data);
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: RequestWithUser }>().req.user;

    if (!user) throw new InternalServerErrorException('');

    return user;

    // return !data ? user : user[data];
  },
);
