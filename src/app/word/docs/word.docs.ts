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
import { Word } from '../entities/word.entity';

export function SwaggerCreateWordDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Create a new word',
      tag: SwaggerTagName.Word,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.WordAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The created word',
      isArray: false,
      dto: Word,
    }),
  );
}

export function SwaggerEditWordDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Edit a word',
      tag: SwaggerTagName.Word,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.WordAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The edited word',
      isArray: false,
      dto: Word,
    }),
  );
}

export function SwaggerAdminFindWordDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Admin find all words with pagination and filtering',
      tag: SwaggerTagName.Word,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.WordAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The words have been successfully retrieved.',
      isArray: true,
      dto: Word,
    }),
  );
}

export function SwaggerFindWordDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Find all words with pagination and filtering',
      tag: SwaggerTagName.Word,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.WordAdmin,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'The words have been successfully retrieved.',
      isArray: true,
      dto: Word,
    }),
  );
}
