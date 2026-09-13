import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    name: 'statusCode',
    type: 'number',
    required: true,
    nullable: false,
    description: 'return specific status code for every endpoints',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'message',
    required: true,
    nullable: false,
    description: 'Message base on language',
    type: 'string',
    example: 'message endpoint',
  })
  message: string;

  @ApiProperty({
    name: 'data',
    required: false,
    nullable: true,
    description: 'Data return from endpoint',
    type: 'string',
    example: [],
  })
  data?: Record<string, any> | Array<Record<string, any>> | Array<string>;
}
