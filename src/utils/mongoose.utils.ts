import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { ClassConstructor, Transform, Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Schema as MongooseSchema, PipelineStage, Model } from 'mongoose';

import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
  Type as TypeType,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
  Schema,
  SchemaFactory,
  SchemaOptions,
} from '@nestjs/mongoose';
import {
  MongoQueryModel,
  MongoQueryOptions,
  parseMongoQuery,
} from './mongo-query.utils';
import { Types } from 'mongoose';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    type: Number,
    required: false,
    description: 'page number',
    example: 1,
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    type: Number,
    description: 'limit number',
    required: false,
    example: 10,
  })
  limit: number = 10;
}

export enum LanguageEnum {
  English = 'en',
  Arabic = 'ar',
}

export class Language {
  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    type: String,
    description: 'english string',
    example: 'en',
  })
  en: string;

  @Prop({
    type: String,
    required: true,
  })
  @ApiProperty({
    type: String,
    description: 'arabic string',
    example: 'ar',
  })
  ar: string;
}

export class LanguageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'english string',
    example: 'en',
  })
  @Transform(({ value }) => value.trim())
  en: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'arabic string',
    example: 'ar',
  })
  @Transform(({ value }) => value.trim())
  ar: string;
}

export class PriceDto {
  @IsNumber()
  @ApiProperty({
    type: String,
    description: 'EGYPTIAN price',
    example: 1000,
  })
  EGYPTIAN: string;

  @IsNumber()
  @ApiProperty({
    type: String,
    description: 'NON EGYPTIAN price',
    example: 1000,
  })
  NON_EGYPTIAN: string;
}

class Device {
  @Prop({
    type: String,
  })
  type: string;

  @Prop({
    type: String,
  })
  vendor: string;
}

class OS {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  version: string;
}

export class UserAgent {
  @Prop({
    type: String,
    required: true,
  })
  value: string;

  @Prop({
    type: String,
    required: true,
  })
  browser: string;

  @Prop({
    type: OS,
    required: true,
  })
  os: OS;

  @Prop({
    type: Device,
    required: true,
  })
  device: Device;
}

export class MongoIdParam {
  @IsMongoId()
  @ApiProperty({
    type: String,
    name: 'id',
    required: true,
    description: 'Mongo id of the resource',
    example: '5f5f5f5f5f5f5f5f5f5f5f5f',
  })
  id: string;
}
export function DatabaseConnection(): ParameterDecorator {
  return InjectConnection();
}

export function InjectDatabaseModel(entity: string): ParameterDecorator {
  return InjectModel(entity);
}

export function DatabaseEntity(options?: SchemaOptions): ClassDecorator {
  return Schema({
    versionKey: false,
    timestamps: true,
    autoIndex: true,
    ...options,
  });
}

export function DatabaseSchema<T = any, N = MongooseSchema<T>>(
  entity: TypeType<T>,
  deletedAt: boolean = true,
): N {
  const schema = SchemaFactory.createForClass<T>(entity);

  if (deletedAt) {
    schema.add({
      // @ts-expect-error ignore this field
      deletedAt: {
        type: Date,
        index: true,
      },
    });
  }

  return schema as N;
}

export function DatabaseQueryContain(
  field: string,
  value: string,
  isFullWord: boolean = false,
) {
  if (isFullWord) {
    return {
      [field]: {
        $regex: new RegExp(`\\b${value}\\b`),
        $options: 'i',
      },
    };
  }

  return {
    [field]: {
      $regex: new RegExp(value),
      $options: 'i',
    },
  };
}

export function addPagination(
  paginationDto: PaginationDto,
  additionalStages: PipelineStage[] = [],
): any {
  return [
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $skip: (paginationDto.page - 1) * paginationDto.limit },
          { $limit: paginationDto.limit },
          ...additionalStages,
        ],
      },
    },
    {
      $project: {
        total: {
          $cond: {
            if: {
              $eq: [{ $size: '$metadata' }, 0],
            },
            then: 0,
            else: {
              $getField: {
                field: 'total',
                input: {
                  $arrayElemAt: ['$metadata', 0],
                },
              },
            },
          },
        },
        data: '$data',
      },
    },
  ];
}

export function MongoQueryDto(dto: ClassConstructor<any>) {
  const d = Object.assign({}, new dto());
  return applyDecorators(
    ...(Array.from({ length: Object.keys(d).length }, (_, i) => {
      return ApiQuery({
        type: typeof d[Object.keys(d)[i]],
        name: Object.keys(d)[i],
        required: false,
      });
    }) as any),
  );
}

export const MongoQuery: (
  opts?: MongoQueryOptions | undefined,
) => ParameterDecorator = createParamDecorator(
  (
    opts: MongoQueryOptions | undefined,
    ctx: ExecutionContext,
  ): MongoQueryModel => {
    const query = ctx.getArgByIndex(0).query;
    return parseMongoQuery(query, opts);
  },
);

export async function sanitizeAggregationPipelineForOneDocument(
  model: Model<any>,
  pipeline: PipelineStage[] = [],
  exception: any = new NotFoundException(`Not Found`),
): Promise<any> {
  const [result] = await model.aggregate(pipeline);

  if (!result) throw exception;

  return result;
}

export async function sanitizeAggregationPipeline(
  model: Model<any>,
  query: MongoQueryModel | any,
  paginationDto: PaginationDto,
  options: {
    additionalStages?: PipelineStage[];
    allowDiskUse?: boolean;
  } = {
    additionalStages: [],
    allowDiskUse: false,
  },
): Promise<{
  total: number;
  data: any[];
}> {
  const parentStages: any = [
    {
      $match: {
        deletedAt: { $exists: false },
      },
    },
  ];

  const lowerStages: any = [];

  if (Object.values(query.filter ?? {}).length) {
    parentStages[0]['$match'] = {
      ...parentStages[0]['$match'],
      ...query.filter,
    };
  }

  if (Object.values(query.sort ?? {}).length) {
    parentStages.push({ $sort: query.sort });
  }

  if (Object.values(query.select ?? {}).length) {
    lowerStages.push({ $project: query.select });
  }

  const result = await model.aggregate(
    [
      ...parentStages,
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: (paginationDto.page - 1) * paginationDto.limit },
            { $limit: paginationDto.limit },
            ...lowerStages,
            ...(options.additionalStages ?? []),
          ],
        },
      },
      {
        $project: {
          total: {
            $cond: {
              if: {
                $eq: [{ $size: '$metadata' }, 0],
              },
              then: 0,
              else: {
                $getField: {
                  field: 'total',
                  input: {
                    $arrayElemAt: ['$metadata', 0],
                  },
                },
              },
            },
          },
          data: '$data',
        },
      },
    ],
    { allowDiskUse: options.allowDiskUse ?? false },
  );

  return (
    result[0] ?? {
      total: 0,
      data: [],
    }
  );
}

export async function OrderSchema(self: any): Promise<number> {
  const collection = self.constructor;

  const lastDocument = await collection
    .findOne({
      deletedAt: { $exists: false },
    })
    .sort({ order: -1 });

  return lastDocument != null ? lastDocument.order + 1 : 1;
}

export async function ReversedOrderSchema(self: any): Promise<number> {
  const collection = self.constructor;

  const lastDocument = await collection
    .findOne({
      deletedAt: { $exists: false },
    })
    .sort({ order: 1 });

  return lastDocument != null ? lastDocument.order + 1 : 999;
}

export async function ReSortModelOrder(
  model: any,
  document: any,
  newOrder: number,
  extraFilters: object = {},
) {
  if (document.order === newOrder)
    throw new BadRequestException('new order is same as old order');

  const lastDocument = await model
    .findOne({
      deletedAt: { $exists: false },
      ...extraFilters,
    })
    .sort({ order: -1 });

  const count = lastDocument?.order || 0;
  if (newOrder > count)
    throw new BadRequestException('new order is greater than the last order');

  const oldOrder = document.order;

  if (oldOrder < newOrder) {
    await model.updateMany(
      {
        deletedAt: { $exists: false },
        order: { $gt: oldOrder, $lte: newOrder },
        ...extraFilters,
      },
      { $inc: { order: -1 } },
    );
  }

  if (oldOrder > newOrder) {
    await model.updateMany(
      {
        deletedAt: { $exists: false },
        order: { $gte: newOrder, $lt: oldOrder },
        ...extraFilters,
      },
      { $inc: { order: 1 } },
    );
  }

  document.order = newOrder;
  await document.save();

  // const filters: any = {
  //   deletedAt: { $exists: false },
  //   _id: { $ne: document._id },
  //   order: { $lte: newOrder, $gte: oldOrder },
  //   ...extraFilters,
  // };

  // const update: any = {
  //   $inc: { order: -1 },
  // };

  // if (count > newOrder) {
  //   filters.order = { $gte: newOrder, $lt: oldOrder };
  //   update.$inc = { order: 1 };
  // }

  // await model.updateMany(filters, update);
}

export class ResortDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'New order',
    example: 1,
  })
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Type(() => Number)
  newOrder: number;
}

export function transformMongoIds(obj: object) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = new Types.ObjectId(obj[key]);
    } else {
      obj[key] = obj[key].map((item: any) => new Types.ObjectId(item));
    }
  });
  return obj;
}

export class GetSlugDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Region slug (lowercase, alphanumeric, hyphen allowed)',
    example: 'valorant',
  })
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase alphanumeric and may include hyphens (no spaces, no special characters)',
  })
  slug: string;
}
