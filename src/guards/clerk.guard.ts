import { verifyToken } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/app/user/user.service';
import { IS_PUBLIC_KEY } from 'src/constants/app.constants';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await verifyToken(token, {
        secretKey: this.configService.get('app.jwt.user.clerkSecretKey'),
      });

      const user = await this.userService.findOne({ clerkID: payload.sub });
      if (!user) throw new UnauthorizedException('User not found');

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
