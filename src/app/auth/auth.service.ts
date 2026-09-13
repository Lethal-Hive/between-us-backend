import { Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Gender } from '../user/constants/user.constants';
import { I18nService } from 'src/common/i18n/i18n.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StaffLoginDto } from './dto/auth.dto';
import { StaffPayload } from 'src/constants/guard.constants';
import { StaffService } from '../staff/staff.service';
import { UserService } from '../user/user.service';
import { extractHeadersData } from 'src/utils/helpers.utils';
import { getUTCDate } from 'src/utils/dayjs.utils';

@Injectable()
export class AuthService {
  constructor(
    public readonly userService: UserService,
    public readonly staffService: StaffService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  staffToken(payload: StaffPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwt.staff.secret'),
    });
  }

  async handleUserCreated(clerkEvent: any) {
    console.log('Clerk User Created Event:', clerkEvent);
    const firstEmailAddress = clerkEvent.email_addresses?.[0];
    const externalAccount = clerkEvent.external_accounts;
    const externalAccountData = {};

    if (externalAccount.length > 0) {
      const accountData = externalAccount[0];
      externalAccountData['provider'] = accountData.provider;
      externalAccountData['name'] =
        accountData.first_name + ' ' + accountData.last_name;
      externalAccountData['isEmailVerified'] =
        accountData.verification?.status === 'verified';
    }

    const eventData = {
      clerkID: clerkEvent.id,
      name: clerkEvent.first_name + ' ' + clerkEvent.last_name,
      email: firstEmailAddress?.email_address,
      gender: clerkEvent.unsafeMetadata?.gender || Gender.Male,
      isEmailVerified: firstEmailAddress?.verification?.status === 'verified',
      ...externalAccountData,
    };

    await this.userService.create(eventData);
  }

  async handleUserUpdated(clerkEvent: any) {
    const firstEmailAddress = clerkEvent.email_addresses?.[0];
    const externalAccount = clerkEvent.external_accounts;
    const externalAccountData: Record<string, any> = {};

    if (externalAccount?.length > 0) {
      const accountData = externalAccount[0];
      externalAccountData['provider'] = accountData.provider;
      externalAccountData['name'] =
        accountData.first_name + ' ' + accountData.last_name;
      externalAccountData['isEmailVerified'] =
        accountData.verification?.status === 'verified';
    }

    const updateData: Record<string, any> = {
      name: clerkEvent.first_name + ' ' + clerkEvent.last_name,
      email: firstEmailAddress?.email_address,
      isEmailVerified: firstEmailAddress?.verification?.status === 'verified',
      ...externalAccountData,
    };

    if (clerkEvent.unsafeMetadata?.gender) {
      updateData['gender'] = clerkEvent.unsafeMetadata.gender;
    }

    await this.userService.update({ clerkID: clerkEvent.id }, updateData);
  }

  async handleUserDeleted(clerkEvent: any) {
    const user = await this.userService.findOne({
      clerkID: clerkEvent.id,
    });

    if (user) {
      await user.deleteOne();
    }
  }

  async staffLogin(staffLoginDto: StaffLoginDto, req: Request) {
    const staff = await this.staffService.findOne({
      email: staffLoginDto.email,
    });

    if (!staff) throw new NotFoundException('Staff not found');

    const meta = extractHeadersData(req);

    const isPassword = await staff.passwordCheck(staffLoginDto.password);
    if (!isPassword) throw new NotFoundException('Staff not found');

    const token = await this.staffToken({ id: staff._id });
    staff.token = token;
    staff.lastLogin = {
      loggedInAt: getUTCDate().toDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    };

    await staff.save();

    return staff;
  }
}
