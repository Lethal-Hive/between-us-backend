import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { I18nModule } from 'src/common/i18n/i18n.module';
import { GameGateway } from './gateway/game.gateway';
import { GameSockets } from './game.sockets';
import { UserModule } from '../user/user.module';
import { PlayerModule } from '../player/player.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './entities/game.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    I18nModule,
    UserModule,
    PlayerModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameSockets, GameGateway],
  exports: [GameService, GameGateway],
})
export class GameModule {}
