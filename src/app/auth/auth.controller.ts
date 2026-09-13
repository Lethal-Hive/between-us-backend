import {
  BadRequestException,
  Body,
  Headers,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { Staff } from '../staff/entities/staff.entity';
import { Public } from 'src/decorators/public.decorator';
import { SwaggerStaffLogin } from './docs/auth.docs';
import { StaffLoginDto } from './dto/auth.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@SwaggerAuthController('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/staff/login')
  @Serialize(Staff)
  @Public()
  @SwaggerStaffLogin()
  staffSignin(@Body() staffLoginDto: StaffLoginDto, @Req() req: Request) {
    return this.authService.staffLogin(staffLoginDto, req);
  }
  //eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zQmQ1Y0EwbEJ5UDNJRXFZZlR3SGpjcENMczEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NzQ5MDY4NDEsImZ2YSI6WzAsLTFdLCJpYXQiOjE3NzQ5MDY3ODEsImlzcyI6Imh0dHBzOi8vZ2VuZXJvdXMtYnV6emFyZC04MS5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3NzQ5MDY3NzEsInNpZCI6InNlc3NfM0JnTlZ3TGRsNHZxRnE2aGVLTWRrM3lHSEFNIiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8zQmdOVndQdVJCYzVrNzRyU0JVRllWaXNpVUMiLCJ2IjoyfQ.MW_kxalux4n_BICN3zASWmTtzO_SqJ1SZwN1aZZpgCh6Tb2i8CDXs815jDMRR9oSiiHWrJIukpfQqEOR7oGzFEnlBuya4nuFC7lo68FNM6AvOaQsQ6vVN4CKJpnEZGQ2vwIeUbA1VcA0Fznvr5X4zROmQq000rbToIEI_vp1wzIjr0KNdocc7Nfhlczbck3bGDt7GEKphv4IpQwsQY5RH1IK28gznEwKtBYzbDYTmTJ6sSVYBuzIT7hCbt1zlBI9K9NEVhez_ZV4dcDHsaN0ej8t7641et7HbMHCCw7urUz6ib7-PP9EAz4BvoRTGlf54wCsWd_BgRyurM0H09rSQg
  @UseGuards(ClerkAuthGuard)
  @Post('/test')
  test(@GetUser() user: any) {
    console.log('Authenticated user:', user);
    return { message: 'You are authenticated with Clerk!', user };
  }

  @Post('/webhook/clerk')
  @Public()
  async clerkWebhook(
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
  ) {
    const secret = this.configService.get<string>(
      'app.jwt.user.clerkWebhookSecret',
    );

    const wh = new Webhook(secret as string);

    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];

    if (!svixId || !svixTimestamp || !svixSignature)
      throw new BadRequestException('Missing svix headers');

    let event: any;
    try {
      // req.rawBody is available because we enabled rawBody: true in main.ts
      event = wh.verify((req as any).rawBody as Buffer, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    // console.log('Received Clerk webhook event:', event);

    switch (event.type) {
      case 'user.created':
        await this.authService.handleUserCreated(event.data);
        break;
      case 'user.updated':
        await this.authService.handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await this.authService.handleUserDeleted(event.data);
        break;
    }

    return { received: true };
  }
}
