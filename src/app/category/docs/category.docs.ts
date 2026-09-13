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
import { Category } from '../entities/category.entity';

export function SwaggerCreateCategoryDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Create a new category',
      tag: SwaggerTagName.Category,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.CategoryAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The category has been successfully created.',
      isArray: false,
      dto: Category,
    }),
  );
}

export function SwaggerEditCategoryDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Edit a category',
      tag: SwaggerTagName.Category,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.CategoryAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The category has been successfully edited.',
      isArray: false,
      dto: Category,
    }),
  );
}

export function SwaggerAdminFindCategoryDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Admin find all categories',
      tag: SwaggerTagName.Category,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.CategoryAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The categories have been successfully retrieved.',
      isArray: true,
      dto: Category,
    }),
  );
}

export function SwaggerFindCategoryDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Find all categories',
      tag: SwaggerTagName.Category,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.CategoryAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The categories have been successfully retrieved.',
      isArray: true,
      dto: Category,
    }),
  );
}
