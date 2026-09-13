import {
  SwaggerApiDoc,
  SwaggerApiResponseDoc,
} from 'src/common/swagger/decorators/swagger.decorator';
import {
  SwaggerTagName,
  SwaggerTagNumber,
} from 'src/constants/swagger.constants';

import { ENUM_SWAGGER_TAG_TYPE } from 'src/common/swagger/constants/swagger.constants';
import { User } from 'src/app/user/entities/user.entity';
import { applyDecorators } from '@nestjs/common';

export function SwaggerSetGender() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Set User Gender',
      tag: SwaggerTagName.User,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.UserAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Gender updated successfully',
      isArray: false,
      dto: User,
    }),
  );
}
