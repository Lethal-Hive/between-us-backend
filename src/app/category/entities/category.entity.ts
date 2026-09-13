import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, HydratedDocument, Model } from 'mongoose';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import {
  DatabaseEntity,
  DatabaseSchema,
  Language,
} from 'src/utils/mongoose.utils';

export type CategoryDocument = HydratedDocument<Category>;
export type CategoryParametersType = Document<unknown, object, Category> &
  Category &
  Required<{ _id: string }>;

export type CategoryModel = Model<CategoryDocument>;

@DatabaseEntity()
export class Category {
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
      type: Language,
      required: true,
      description: 'Category name',
      example: {
        en: 'Electronics',
        ar: 'إلكترونيات',
      },
    },
  })
  @Prop({ type: Language, required: true })
  name: Language;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Category words count',
      example: 'statue_icon',
    },
  })
  @Prop({ type: String, required: true })
  icon: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Category words count',
      example: 100,
    },
  })
  @Prop({ type: Number, default: 0 })
  wordsCount: number;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Number,
      required: true,
      description: 'Category words nfsw count',
      example: 100,
    },
  })
  @Prop({ type: Number, default: 0 })
  wordsNFSWCount: number;
}

export const CategorySchema = DatabaseSchema(Category);
