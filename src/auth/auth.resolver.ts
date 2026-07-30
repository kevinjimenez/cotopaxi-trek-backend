import { Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
}
