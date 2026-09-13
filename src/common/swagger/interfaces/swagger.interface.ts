import { HttpStatus } from '@nestjs/common';
import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import {
  ENUM_SWAGGER_REQUEST_BODY_TYPE,
  ENUM_SWAGGER_TAG_TYPE,
} from '../constants/swagger.constants';

export interface IDocOptions {
  summary?: string;
  operation?: string;
  deprecated?: boolean;
  description?: string;
  version?: string;
  tag: string;
  tagType?: ENUM_SWAGGER_TAG_TYPE;
  tagNumber: number;
}

export interface IDocOfOptions<T = any> {
  statusCode: number;
  messagePath: string;
  dto?: ClassConstructor<T>;
}

export interface IDocDefaultOptions<T = any> extends IDocOfOptions<T> {
  httpStatus: HttpStatus;
}

export interface IDocRequestOptions<T = any> {
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  bodyType?: ENUM_SWAGGER_REQUEST_BODY_TYPE;
  dto?: ClassConstructor<T>;
}
export interface IDocGuardOptions {
  policy?: boolean;
  role?: boolean;
}

export interface IDocResponseOptions<T = any> {
  statusCode?: number;
  httpStatus?: HttpStatus;
  dto?: ClassConstructor<T>;
}
