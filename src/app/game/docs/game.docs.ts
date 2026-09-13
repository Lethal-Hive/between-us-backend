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

export function SwaggerGetLastPlayedGameDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Get last played game',
      tag: SwaggerTagName.Game,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.GamePublic,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully retrieved last played game',
      isArray: false,
      dto: {
        lastPlayed: {
          time: '14 minutes ago',
          user: 'John Doe',
        },
      },
    }),
  );
}

export function SwaggerGetAllConnectedUsersDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Get all connected users',
      tag: SwaggerTagName.Game,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.GamePublic,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Successfully retrieved all connected users',
      isArray: false,
      dto: {
        users: 0,
      },
    }),
  );
}
