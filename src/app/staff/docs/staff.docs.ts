import { applyDecorators } from '@nestjs/common';
import { ENUM_SWAGGER_TAG_TYPE } from 'src/common/swagger/constants/swagger.constants';
import {
  SwaggerApiDoc,
  SwaggerApiResponseDoc,
} from 'src/common/swagger/decorators/swagger.decorator';
import {
  SwaggerTagName,
  SwaggerTagNumber,
} from 'src/constants/swagger.constants';

export function SwaggerCreateStaff() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Create a new staff member',
      tag: SwaggerTagName.Staff,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.StaffAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully staff created',
      isArray: false,
      dto: {
        _id: '64b8c0f1f1d2c2a1b2c3d4e',
        name: 'John Doe',
        email: 'email@example.com',
        phone: '+1234567890',
        role: '5f8d0d55b54764421b7156c5',
      },
    }),
  );
}

export function SwaggerDeleteStaff() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Delete a staff member',
      tag: SwaggerTagName.Staff,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.StaffAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully staff deleted',
      isArray: false,
      dto: {
        message: 'Staff deleted successfully',
      },
    }),
  );
}
