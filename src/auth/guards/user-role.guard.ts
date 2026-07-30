import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import type { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    console.log({ validRoles });

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext<{ req: RequestWithUser }>().req;

    if (!user) throw new BadRequestException('');

    const valid = validRoles.includes(user.role);

    if (valid) return true;

    throw new ForbiddenException('');
  }
}
