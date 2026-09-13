import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Document, HydratedDocument, Model } from 'mongoose';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import {
  DatabaseEntity,
  DatabaseSchema,
  LanguageEnum,
} from 'src/utils/mongoose.utils';
import { Gender, Provider } from '../constants/user.constants';
export type UserDocument = HydratedDocument<User>;
export type UserParametersType = Document<unknown, object, User> &
  User &
  Required<{ _id: string }>;

export type UserModel = Model<UserDocument>;

@DatabaseEntity()
export class User {
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
      enum: Provider,
      default: Provider.Clerk,
      description: 'User creation provider',
      example: Provider.Clerk,
    },
  })
  @Prop({ type: String, enum: Provider, default: Provider.Clerk })
  provider: Provider;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'User clerk ID',
      example: 'clerk_1234567890abcdef',
    },
  })
  @Prop({ type: String, required: true })
  clerkID: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'User name',
      example: 'John Doe',
    },
  })
  @Prop({ type: String, required: true })
  name: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'User email',
      example: 'example@gmail.com',
    },
  })
  @Prop({ type: String, required: true, lowercase: true })
  email: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      description: 'User gender',
      enum: Gender,
      example: Gender.Male,
    },
  })
  @Expose()
  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      description: 'User language',
      enum: LanguageEnum,
      default: LanguageEnum.English,
      example: LanguageEnum.English,
    },
  })
  @Expose()
  @Prop({ type: String, enum: LanguageEnum, default: LanguageEnum.English })
  language: LanguageEnum;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: Boolean,
      required: true,
      description: 'User email verification status',
      example: false,
    },
  })
  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'token',
    example: 'TOKEN_LONG_HASHED_STRING',
  })
  token: string;

  passwordCheck: (password: string) => Promise<boolean>;
}

export const UserSchema = DatabaseSchema(User);
