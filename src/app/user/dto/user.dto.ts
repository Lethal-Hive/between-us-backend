import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { Gender } from '../constants/user.constants';

export class SignupUserDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User email',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User gender',
    enum: Gender,
    example: Gender.Male,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginUserDto extends PickType(SignupUserDto, [
  'email',
  'password',
] as const) {}

export class SetGenderDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User gender',
    enum: Gender,
    example: Gender.Male,
  })
  @IsEnum(Gender)
  gender: Gender;
}
