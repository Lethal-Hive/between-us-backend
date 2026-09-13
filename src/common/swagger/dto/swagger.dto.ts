import { ClassConstructor } from 'class-transformer';

type CustomApiResponseDataType = {
  [key: string]: unknown;
};
export class SwaggerParamsDto {
  status: number;
  description: string;
  isArray: boolean;

  dto: ClassConstructor<any> | CustomApiResponseDataType | string;
}
