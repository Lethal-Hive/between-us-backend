import { Injectable } from '@nestjs/common';
import { InjectDatabaseModel } from 'src/utils/mongoose.utils';
import { Game, GameModel, GameParametersType } from './entities/game.entity';
import { AnyKeys, FilterQuery } from 'mongoose';
import { getUTCDate } from 'src/utils/dayjs.utils';
import { UserDocument } from '../user/entities/user.entity';

@Injectable()
export class GameService {
  constructor(@InjectDatabaseModel(Game.name) private gameModel: GameModel) {}

  findOne(query: FilterQuery<GameParametersType>) {
    return this.gameModel.findOne(query);
  }

  create(data: AnyKeys<GameParametersType>) {
    return this.gameModel.create(data);
  }

  async getLastPlayedGame() {
    const lastPlayedGame = await this.gameModel
      .findOne({ status: 'ended' })
      .sort({ updatedAt: -1 })
      .populate<{ user: UserDocument }>('user');
    if (!lastPlayedGame)
      return {
        lastPlayed: {
          time: '2 minutes ago',
          user: 'Youssef Walied',
        },
      };
    return {
      lastPlayed: {
        time: getUTCDate(lastPlayedGame.updatedAt).fromNow(),
        user: lastPlayedGame.user?.name || 'Unknown User',
      },
    };
  }
}
