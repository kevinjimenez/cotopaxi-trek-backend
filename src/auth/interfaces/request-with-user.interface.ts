import type { Request } from 'express';
import type { AuthenticatedUser } from '../types/authenticated-user.type';

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}
