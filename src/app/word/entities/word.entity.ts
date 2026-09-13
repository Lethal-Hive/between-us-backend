import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, HydratedDocument, Model, Schema } from 'mongoose';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import {
  DatabaseEntity,
  DatabaseSchema,
  Language,
} from 'src/utils/mongoose.utils';
import { Difficulty } from '../constants/word.constants';
import { Category } from 'src/app/category/entities/category.entity';

export type WordDocument = HydratedDocument<Word>;
export type WordParametersType = Document<unknown, object, Word> &
  Word &
  Required<{ _id: string }>;

export type WordModel = Model<WordDocument>;

@DatabaseEntity()
export class Word {
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
      description: 'Lobby category',
      example: '5f9f9f9f9f9f9f9f9f9f9f9f',
    },
  })
  @Prop({ type: Schema.Types.ObjectId, ref: Category.name, required: true })
  category: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Language,
      required: true,
      description: 'Word name',
      example: {
        en: 'Graphics Card',
        ar: 'بطاقة الرسومات',
      },
    },
  })
  @Prop({ type: Language, required: true })
  name: Language;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Boolean,
      required: true,
      description: 'Whether the word is NSFW defaults to false',
      example: false,
    },
  })
  @Prop({ type: Boolean, default: false })
  isNSFW: boolean;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      enum: Difficulty,
      description: 'Word difficulty',
      example: Difficulty.MEDIUM,
    },
  })
  @Prop({ type: String, enum: Difficulty, required: true })
  difficulty: Difficulty;
}

export const WordSchema = DatabaseSchema(Word);
