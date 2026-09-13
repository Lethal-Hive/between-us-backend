import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({
    required: true,
    description: 'Staff name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'Staff email',
    example: 'email@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'Staff phone',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    required: true,
    description: 'Staff password',
    example: 'P@ssw0rd',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    required: true,
    description: 'Staff role',
    example: 'admin',
  })
  @IsMongoId()
  role: string;
}
