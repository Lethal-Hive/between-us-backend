import { Prop } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document, HydratedDocument, Model } from 'mongoose';
import { SwaggerDefineProperty } from 'src/common/swagger/decorators/swagger.decorator';
import {
  DatabaseEntity,
  DatabaseSchema,
  UserAgent,
} from 'src/utils/mongoose.utils';
import * as bcrypt from 'bcrypt';
import { getUTCDate } from 'src/utils/dayjs.utils';
import { Role } from 'src/constants/app.constants';

export type StaffDocument = HydratedDocument<Staff>;
export type StaffParametersType = Document<unknown, object, Staff> &
  Staff &
  Required<{ _id: string }>;

export type StaffModel = Model<StaffDocument>;

@DatabaseEntity({ timestamps: false, _id: false })
class LoginInfo {
  @Prop({
    type: Date,
    default: getUTCDate().toDate(),
  })
  loggedInAt: Date;

  @Prop({
    type: String,
    required: true,
  })
  ipAddress: string;

  @Prop({
    type: UserAgent,
    required: true,
  })
  userAgent: UserAgent;
}

@DatabaseEntity()
export class Staff {
  @Transform((value) => {
    if (value.obj) return value.obj._id.toString();
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
      description: 'Staff name',
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
      description: 'Staff email',
      example: 'example@gmail.com',
    },
  })
  @Prop({ type: String, required: true, lowercase: true })
  email: string;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Staff phone',
      example: '+201000000000',
    },
  })
  @Prop({ type: String, required: true })
  phone: string;

  @Exclude()
  @Prop({ type: String, required: true })
  password: string;

  @Exclude()
  @Prop({ type: LoginInfo })
  lastLogin: LoginInfo;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      required: true,
      description: 'Staff role',
      enum: Role,
      example: Role.Admin,
    },
  })
  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @SwaggerDefineProperty({
    showInSerializer: true,
    swagger: {
      type: String,
      description: 'token',
      example: 'TOKEN_LONG_HASHED_STRING',
    },
  })
  token: string;

  passwordCheck: (password: string) => Promise<boolean>;
}

export const StaffSchema = DatabaseSchema(Staff);

StaffSchema.pre('save', async function (this: StaffDocument, next: any) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

StaffSchema.methods.passwordCheck = async function (password: string) {
  const isPassword = await bcrypt.compare(password, this.password);
  return isPassword;
};
