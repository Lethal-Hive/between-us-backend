import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class StaffLoginDto {
  @ApiProperty({
    required: true,
    description: 'The email of the staff member',
    example: 'youssef.walied@lethalhive.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'The password of the staff member',
    example: 'testxd',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
