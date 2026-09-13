import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, HydratedDocument, Model, Schema } from 'mongoose';
import { Category } from 'src/app/category/entities/category.entity';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import { DatabaseEntity, DatabaseSchema } from 'src/utils/mongoose.utils';
import {
  GameLanguage,
  LobbyMode,
  LobbyStatus,
} from '../constants/lobby.constants';
import { User } from 'src/app/user/entities/user.entity';

export type LobbyDocument = HydratedDocument<Lobby>;
export type LobbyParametersType = Document<unknown, object, Lobby> &
  Lobby &
  Required<{ _id: string }>;

export type LobbyModel = Model<LobbyDocument>;

@DatabaseEntity()
export class Lobby {
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
      description: 'Lobby code',
      example: 'LYX-QA2',
    },
  })
  @Prop({ type: String })
  code: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: LobbyMode,
      description: 'Lobby mode',
      example: LobbyMode.Category,
    },
  })
  @Prop({ type: String, default: LobbyMode.Category })
  mode: LobbyMode;

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
      type: [String],
      required: true,
      description: 'Lobby category',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: [Schema.Types.ObjectId], ref: Category.name })
  category: string[];

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
      description: 'Lobby password',
      example: 'secret',
    },
  })
  @Prop({ type: String })
  password: string | null;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: LobbyStatus,
      description: 'Lobby status',
      example: LobbyStatus.IN_GAME,
    },
  })
  @Prop({ type: String, enum: LobbyStatus, default: LobbyStatus.OPEN })
  status: LobbyStatus;

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

export const LobbySchema = DatabaseSchema(Lobby);

LobbySchema.pre('save', async function () {
  if (this.isNew) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generate = () => {
      const half = Array.from(
        { length: 3 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
      const half2 = Array.from(
        { length: 3 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
      return `${half}-${half2}`;
    };

    let code: string;
    do {
      code = generate();
    } while (await (this.constructor as LobbyModel).exists({ code }));

    this.code = code;
  }
});
