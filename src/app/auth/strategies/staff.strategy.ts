import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { StaffPayload, Strategies } from 'src/constants/guard.constants';
import { I18nService } from 'src/common/i18n/i18n.service';

@Injectable()
export class JwtStaffStrategy extends PassportStrategy(
  Strategy,
  Strategies.Staff,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwt.staff.secret'),
    });
  }

  async validate(payload: StaffPayload) {
    const staff = await this.authService.staffService.findOne({
      _id: payload.id,
    });

    if (!staff) this.i18n.error(UnauthorizedException, 'COMMON.INVALID_TOKEN');

    return staff;
  }
}
