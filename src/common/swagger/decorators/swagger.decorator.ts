import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiProperty,
  ApiPropertyOptions,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../dto/swagger-response.dto';
import {
  Controller,
  HttpStatus,
  Version,
  applyDecorators,
} from '@nestjs/common';
import {
  IDocDefaultOptions,
  IDocGuardOptions,
  IDocOptions,
  IDocRequestOptions,
} from '../interfaces/swagger.interface';
import {
  ENUM_SWAGGER_REQUEST_BODY_TYPE,
  ENUM_SWAGGER_TAG_TYPE,
} from '../constants/swagger.constants';
import { SwaggerParamsDto } from '../dto/swagger.dto';
import { ClassConstructor, Exclude, Expose } from 'class-transformer';
import { I18nService } from 'src/common/i18n/i18n.service';

const BodyType = {
  [ENUM_SWAGGER_REQUEST_BODY_TYPE.FORM_DATA]: 'multipart/form-data',
  [ENUM_SWAGGER_REQUEST_BODY_TYPE.TEXT]: 'text/plain',
  [ENUM_SWAGGER_REQUEST_BODY_TYPE.JSON]: 'application/json',
};

export function SwaggerDefaultResponse<T>(
  options: IDocDefaultOptions<T>,
): MethodDecorator {
  const docs: Array<MethodDecorator> = [];
  const schema: Record<string, any> = {
    allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    properties: {
      message: {
        example: options.messagePath,
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
    },
  };
  if (options.dto) {
    docs.push(ApiExtraModels(options.dto));
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.dto),
      },
    };
  }
  return applyDecorators(
    ApiExtraModels(ResponseDto),
    ApiResponse({
      description: options.httpStatus.toString(),
      status: options.httpStatus,
      schema,
    }),
    ...docs,
  );
}

export function SwaggerApiDoc(options?: IDocOptions): MethodDecorator {
  let swaggerTag: any = [];
  if (process.env.USE_DOCUMENTATION !== 'SCALAR') {
    swaggerTag = [
      ApiTags(
        `${options?.tagNumber}. ${options?.tag} ${options?.tagType ?? ENUM_SWAGGER_TAG_TYPE.PUBLIC}`,
      ),
    ];
  }
  return applyDecorators(
    ApiOperation({
      summary: options?.summary,
      deprecated: options?.deprecated,
      description: options?.description,
    }),
    Version(options?.version ?? '1'),
    ...swaggerTag,
    ApiHeaders([
      {
        name: 'language',
        description: 'Custom language header',
        required: false,
        schema: {
          enum: Object.values(I18nService.supportedLanguages),
          default: I18nService.defaultLanguage,
          example: I18nService.defaultLanguage,
          type: 'string',
        },
      },
    ]),
    SwaggerDefaultResponse({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      messagePath: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }),
    SwaggerDefaultResponse({
      httpStatus: HttpStatus.NOT_FOUND,
      messagePath: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    }),
    SwaggerDefaultResponse({
      httpStatus: HttpStatus.BAD_REQUEST,
      messagePath: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    }),
  );
}

export function SwaggerApiRequestDoc(options?: IDocRequestOptions) {
  const docs: Array<ClassDecorator | MethodDecorator> = [];

  if (options?.bodyType) {
    docs.push(ApiConsumes(BodyType[options.bodyType]));
    docs.push(
      SwaggerDefaultResponse({
        httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        messagePath: 'Unprocessable Entity',
      }),
    );
  }

  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.dto) {
    docs.push(ApiBody({ type: options?.dto }));
  }

  return applyDecorators(...docs);
}

export function SwaggerGuard(options?: IDocGuardOptions) {
  const allForbidden: MethodDecorator[] = [];

  if (options?.role) {
    allForbidden.push(
      SwaggerDefaultResponse({
        statusCode: HttpStatus.FORBIDDEN,
        messagePath: 'Role Forbidden',
        httpStatus: HttpStatus.FORBIDDEN,
      }),
    );
  }

  if (options?.policy) {
    allForbidden.push(
      SwaggerDefaultResponse({
        statusCode: HttpStatus.FORBIDDEN,
        messagePath: 'Ability Forbidden',
        httpStatus: HttpStatus.FORBIDDEN,
      }),
    );
  }

  return applyDecorators(...allForbidden);
}

export function SwaggerAuthController(name: string) {
  return applyDecorators(
    Controller(name.split(' ').join('-').toLowerCase()),
    ApiBearerAuth(),
    ApiTags(),
  );
}

export function SwaggerApiResponseDoc(swaggerParamsDto: SwaggerParamsDto) {
  const responses = {
    object: {
      status: swaggerParamsDto.status,
      description: `${swaggerParamsDto.status} - ${swaggerParamsDto.description}`,
      schema: {
        ...(swaggerParamsDto.isArray
          ? {
              type: 'array',
              items: {
                example: swaggerParamsDto.dto,
              },
            }
          : { example: swaggerParamsDto.dto }),
      },
    },
    string: {
      type: String,
      isArray: swaggerParamsDto.isArray,
      status: swaggerParamsDto.status,
      description: `${swaggerParamsDto.status} - ${swaggerParamsDto.description}`,
      example: swaggerParamsDto.dto,
    },
  };

  const customResponse = responses[typeof swaggerParamsDto.dto] ?? {
    type: swaggerParamsDto.dto,
    isArray: swaggerParamsDto.isArray,
    status: swaggerParamsDto.status,
    description: `${swaggerParamsDto.status} - ${swaggerParamsDto.description}`,
  };

  return applyDecorators(
    ApiProduces('application/json'),
    ApiResponse(customResponse),
  );
}

export function SwaggerDefineProperty(options: {
  showInSerializer: boolean;
  swagger: ApiPropertyOptions;
  implementClass?: ClassConstructor<any> | string;
}) {
  return applyDecorators(
    options.showInSerializer ? Expose() : Exclude(),
    ApiProperty({
      required: false,
      example:
        typeof options.implementClass == 'function'
          ? new options.implementClass()
          : options.implementClass,
      ...(options.swagger as any),
    }),
  );
}
