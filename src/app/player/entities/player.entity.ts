import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, HydratedDocument, Model, Schema } from 'mongoose';
import { Lobby } from 'src/app/lobby/entities/lobby.entity';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import { DatabaseEntity, DatabaseSchema } from 'src/utils/mongoose.utils';
import { PlayerConnectionStatus } from '../constants/player.constants';
import { User } from 'src/app/user/entities/user.entity';

export type PlayerDocument = HydratedDocument<Player>;
export type PlayerParametersType = Document<unknown, object, Player> &
  Player &
  Required<{ _id: string }>;

export type PlayerModel = Model<PlayerDocument>;

@DatabaseEntity()
export class Player {
  @Transform((value) => {
    if (value.obj) return value.obj._id?.toString();
  })
  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'The unique identifier',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  _id: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Lobby id the player is in',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Lobby.name, required: true })
  lobby: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Lobby owner',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: User.name, required: true })
  user: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Player username',
      example: 'Player1',
    },
  })
  @Prop({ type: String, required: true })
  username: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: PlayerConnectionStatus,
      description: 'Player connection status',
      example: PlayerConnectionStatus.Active,
    },
  })
  @Prop({
    type: String,
    enum: PlayerConnectionStatus,
    default: PlayerConnectionStatus.Active,
  })
  connectionStatus: PlayerConnectionStatus;
}

export const PlayerSchema = DatabaseSchema(Player);
