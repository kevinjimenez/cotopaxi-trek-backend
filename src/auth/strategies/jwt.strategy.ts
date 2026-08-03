import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/common/config/envs';
import { UsersService } from 'src/users/services/users.service';
import { JwtPayloadSign } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate({ sub }: JwtPayloadSign) {
    const user = await this.usersService.findByIdentifierWithCredential(sub);
    if (!user || !user.status) {
      throw new UnauthorizedException('');
    }

    return user;
  }
}
