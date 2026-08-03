import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { RoleType } from 'src/databases/generated/prisma/enums';
import { UsersService } from 'src/users/services/users.service';
import { LoginInput } from './dto/login.input';

export interface JwtPayloadSign {
  sub: string;
  role: RoleType;
  companyId: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async login({ password, username }: LoginInput) {
    const user =
      await this.usersService.findByIdentifierWithCredential(username);

    if (!user || !user.credentials) {
      throw new UnauthorizedException('');
    }

    const isValid = await this.bcryptAdapter.compare(
      password,
      user.credentials.password,
    );

    if (!isValid || !user.status) {
      throw new UnauthorizedException('');
    }

    const sign = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      accessToken: this.jwtService.sign(sign),
      user,
    };
  }
}
