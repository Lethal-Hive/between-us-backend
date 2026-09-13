import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { I18nModule } from './common/i18n/i18n.module';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { StaffModule } from './app/staff/staff.module';
import { ClerkClientProvider } from './providers/clerk.provider';
import { WordModule } from './app/word/word.module';
import { CategoryModule } from './app/category/category.module';
import { GameModule } from './app/game/game.module';
import { PlayerModule } from './app/player/player.module';
import { LobbyModule } from './app/lobby/lobby.module';

@Module({
  imports: [
    CommonModule,
    I18nModule,
    AuthModule,
    UserModule,
    StaffModule,
    WordModule,
    CategoryModule,
    GameModule,
    PlayerModule,
    LobbyModule,
  ],
  controllers: [],
  providers: [ClerkClientProvider],
})
export class AppModule {}
