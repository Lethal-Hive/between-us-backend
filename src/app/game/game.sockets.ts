import { verifyToken } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class GameSockets {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async getUser(token: string) {
    try {
      const decoded = await verifyToken(token, {
        secretKey: this.configService.get('app.jwt.user.clerkSecretKey'),
      });

      const user = await this.userService.findOne({ clerkID: decoded.sub });
      return user;
    } catch {
      return null;
    }
  }
}
