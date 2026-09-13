import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { LanguageDto } from 'src/utils/mongoose.utils';

export class CreateCategoryDto {
  @ApiProperty({
    type: LanguageDto,
    required: true,
    description: 'Category name',
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
    description: 'Category icon',
    example: 'statue_icon',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class EditCategoryDto extends PartialType(CreateCategoryDto) {}
