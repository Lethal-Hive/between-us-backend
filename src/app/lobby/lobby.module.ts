import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { I18nModule } from 'src/common/i18n/i18n.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Lobby, LobbySchema } from './entities/lobby.entity';
import { GameModule } from '../game/game.module';
import { UserModule } from '../user/user.module';
import { PlayerModule } from '../player/player.module';
import { WordModule } from '../word/word.module';
import { CategoryModule } from '../category/category.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TurnQueueProcessor, TURN_QUEUE } from './turn-queue.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lobby.name, schema: LobbySchema }]),
    UserModule,
    I18nModule,
    GameModule,
    PlayerModule,
    WordModule,
    CategoryModule,
    BullModule.registerQueueAsync({
      name: TURN_QUEUE,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: process.platform === 'win32' ? '127.0.0.1' : 'localhost',
          port: parseInt(
            configService.get<string>('app')?.['redisPort'] ?? '6379',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LobbyController],
  providers: [LobbyService, TurnQueueProcessor],
})
export class LobbyModule {}
