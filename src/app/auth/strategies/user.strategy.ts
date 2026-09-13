import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserPayload, Strategies } from 'src/constants/guard.constants';
import { I18nService } from 'src/common/i18n/i18n.service';
@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  Strategies.User,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwt.user.secret'),
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.authService.userService.findOne({
      _id: payload.id,
    });

    if (!user) this.i18n.error(UnauthorizedException, 'COMMON.INVALID_TOKEN');

    return user;
  }
}
