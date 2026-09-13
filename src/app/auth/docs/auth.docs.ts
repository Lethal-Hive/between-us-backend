import { applyDecorators } from '@nestjs/common';
import { Staff } from 'src/app/staff/entities/staff.entity';
import { User } from 'src/app/user/entities/user.entity';
import { ENUM_SWAGGER_TAG_TYPE } from 'src/common/swagger/constants/swagger.constants';
import {
  SwaggerApiDoc,
  SwaggerApiResponseDoc,
} from 'src/common/swagger/decorators/swagger.decorator';
import {
  SwaggerTagName,
  SwaggerTagNumber,
} from 'src/constants/swagger.constants';

export function SwaggerStaffLogin() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Staff Login',
      tag: SwaggerTagName.Auth,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.AuthPublic,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully staff logged in',
      isArray: false,
      dto: Staff,
    }),
  );
}

export function SwaggerUserSignup() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'User Signup',
      tag: SwaggerTagName.Auth,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.AuthPublic,
    }),

    SwaggerApiResponseDoc({
      status: 201,
      description: 'Successfully signed up',
      isArray: false,
      dto: User,
    }),
  );
}

export function SwaggerUserLogin() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'User Login',
      tag: SwaggerTagName.Auth,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.AuthPublic,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully logged in',
      isArray: false,
      dto: User,
    }),
  );
}
