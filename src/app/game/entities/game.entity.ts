import { DatabaseEntity, DatabaseSchema } from 'src/utils/mongoose.utils';
import { Document, HydratedDocument, Model, Schema } from 'mongoose';

import { Category } from 'src/app/category/entities/category.entity';
import { GameLanguage } from 'src/app/lobby/constants/lobby.constants';
import { GameStatus } from '../constants/game.constants';
import { Lobby } from 'src/app/lobby/entities/lobby.entity';
import { Player } from 'src/app/player/entities/player.entity';
import { Prop } from '@nestjs/mongoose';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import { Transform } from 'class-transformer';
import { User } from 'src/app/user/entities/user.entity';
import { Word } from 'src/app/word/entities/word.entity';

export type GameDocument = HydratedDocument<Game>;
export type GameParametersType = Document<unknown, object, Game> &
  Game &
  Required<{ _id: string }>;

export type GameModel = Model<GameDocument>;

class Settings {
  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Boolean,
      required: true,
      description: 'Show fake word to impostors',
      example: false,
    },
  })
  @Prop({ type: Boolean, default: false })
  fakeWord: boolean;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Boolean,
      required: true,
      description: 'Show NSFW words to players who are not impostors',
      example: false,
    },
  })
  @Prop({ type: Boolean, default: false })
  showNSFWWords: boolean;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Set imposters count (1 or 2 or more)',
      example: 1,
    },
  })
  @Prop({ type: Number, default: 1 })
  imposterCount: number;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Set rounds count (1 or 2 or more)',
      example: 1,
    },
  })
  @Prop({ type: Number, default: 1 })
  roundsCount: number;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Set timer per round in seconds',
      example: 60,
    },
  })
  @Prop({ type: Number, default: 60 })
  timerPerRound: number;
}

class Voter {
  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Game voter id',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Player.name, required: true })
  voter: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Game voted for player id',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Player.name, required: true })
  votedOn: string;
}

@DatabaseEntity()
export class Game {
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
      description: 'User id the game is associated with',
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
      description: 'Lobby id the game is associated with',
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
      description: 'Category id the game is associated with',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Category.name, required: true })
  category: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Word id the game is associated with',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Word.name, required: true })
  word: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: GameLanguage,
      description: 'Game language',
      example: GameLanguage.ENGLISH,
    },
  })
  @Prop({ type: String, enum: GameLanguage, default: GameLanguage.ENGLISH })
  gameLanguage: GameLanguage;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: GameStatus,
      description: 'Game status',
      example: GameStatus.Live,
    },
  })
  @Prop({ type: String, enum: GameStatus, default: GameStatus.Live })
  status: GameStatus;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Settings,
      required: true,
      description: 'Game settings',
    },
  })
  @Prop({ type: Settings, required: true })
  settings: Settings;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Game fake word id',
      example: ['5f9f9f9f9f9f9f9f9f9f9f9f'],
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Word.name })
  fakeWord: string[];

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: [String],
      required: true,
      description: 'Game imposter id',
      example: ['5f9f9f9f9f9f9f9f9f9f9f9f'],
    },
  })
  @Prop({ type: [Schema.Types.ObjectId], ref: User.name, required: true })
  imposters: string[];

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: [String],
      required: true,
      description: 'Game players id',
      example: ['5f9f9f9f9f9f9f9f9f9f9f9f'],
    },
  })
  @Prop({ type: [Schema.Types.ObjectId], ref: User.name, required: true })
  players: string[];

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: [Voter],
      required: true,
      description: 'Game voters id',
      example: [
        {
          voter: '5f9f9f9f9f9f9f9f9f9f9f9f',
          votedOn: '5f9f9f9f9f9f9f9f9f9f9f9f',
        },
      ],
    },
  })
  @Prop({ type: [Voter] })
  votes: Voter[];

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Current round number',
      example: 1,
    },
  })
  @Prop({ type: Number, default: 1 })
  currentRound: number;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Current turn player id',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: User.name, required: true })
  currentPlayerTurn: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Boolean,
      required: true,
      description: 'Whether the game has started or not',
      example: false,
    },
  })
  @Prop({ type: Boolean, default: false })
  isGameStarted: boolean;

  updatedAt: Date;
}

export const GameSchema = DatabaseSchema(Game);
