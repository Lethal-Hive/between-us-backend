import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';

export const CLERK_CLIENT = 'CLERK_CLIENT';

export const ClerkClientProvider = {
  provide: CLERK_CLIENT,
  useFactory: (configService: ConfigService) => {
    return createClerkClient({
      publishableKey: configService.get('app.jwt.user.clerkPublishableKey'),
      secretKey: configService.get('app.jwt.user.clerkSecretKey'),
    });
  },
  inject: [ConfigService],
};
