import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { StaffModule } from '../staff/staff.module';
import { JwtModule } from '@nestjs/jwt';
import { I18nModule } from 'src/common/i18n/i18n.module';
import { JwtUserStrategy } from './strategies/user.strategy';
import { JwtStaffStrategy } from './strategies/staff.strategy';

@Module({
  imports: [JwtModule.register({}), I18nModule, UserModule, StaffModule],
  controllers: [AuthController],
  providers: [AuthService, JwtUserStrategy, JwtStaffStrategy],
})
export class AuthModule {}
