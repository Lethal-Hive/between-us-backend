import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { LanguageDto } from 'src/utils/mongoose.utils';
import { Difficulty } from '../constants/word.constants';

export class CreateWordDto {
  @ApiProperty({
    type: LanguageDto,
    required: true,
    description: 'Word name',
    example: {
      en: 'Electronics',
      ar: 'إلكترونيات',
    },
  })
  @Type(() => LanguageDto)
  @ValidateNested()
  name: LanguageDto;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Word difficulty',
    enum: Difficulty,
    example: Difficulty.MEDIUM,
  })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({
    type: String,
    required: false,
    description: 'The category id of the word',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  category: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Whether the word is NSFW defaults to false',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isNSFW: boolean;
}

export class EditWordDto extends PartialType(CreateWordDto) {}
