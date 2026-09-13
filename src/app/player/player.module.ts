import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule } from 'src/common/i18n/i18n.module';
import { Player, PlayerSchema } from './entities/player.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    I18nModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
