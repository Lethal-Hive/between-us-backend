import { Injectable } from '@nestjs/common';
import { InjectDatabaseModel } from 'src/utils/mongoose.utils';
import {
  Player,
  PlayerModel,
  PlayerParametersType,
} from './entities/player.entity';
import { AnyKeys, FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class PlayerService {
  constructor(
    @InjectDatabaseModel(Player.name) private playerModel: PlayerModel,
  ) {}

  create(data: AnyKeys<PlayerParametersType>) {
    return this.playerModel.create(data);
  }

  find(query: FilterQuery<PlayerParametersType>) {
    return this.playerModel.find(query);
  }

  findOne(query: FilterQuery<PlayerParametersType>) {
    return this.playerModel.findOne(query);
  }
  updateMany(
    query: FilterQuery<PlayerParametersType>,
    update: UpdateQuery<PlayerParametersType>,
  ) {
    return this.playerModel.updateMany(query, {
      $set: update,
    });
  }

  deleteOne(query: FilterQuery<PlayerParametersType>) {
    return this.playerModel.deleteOne(query);
  }

  deleteMany(query: FilterQuery<PlayerParametersType>) {
    return this.playerModel.deleteMany(query);
  }
}
