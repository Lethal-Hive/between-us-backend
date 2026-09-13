import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { WordService } from './word.service';
import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateWordDto, EditWordDto } from './dto/word.dto';
import {
  SwaggerAdminFindWordDoc,
  SwaggerCreateWordDoc,
  SwaggerEditWordDoc,
  SwaggerFindWordDoc,
} from './docs/word.docs';
import {
  MongoIdParam,
  MongoQuery,
  PaginationDto,
} from 'src/utils/mongoose.utils';
import { MongoQueryModel } from 'src/utils/mongo-query.utils';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';
import { GetLanguage } from 'src/decorators/get-language.decorator';

@SwaggerAuthController('Word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @SwaggerCreateWordDoc()
  @Post('/')
  create(@Body() createWordDto: CreateWordDto) {
    return this.wordService.create(createWordDto);
  }

  @SwaggerEditWordDoc()
  @Patch('/:id')
  edit(@Body() editWordDto: EditWordDto, @Param() mongoIdParam: MongoIdParam) {
    return this.wordService.edit(mongoIdParam.id, editWordDto);
  }

  @SwaggerAdminFindWordDoc()
  @Get('/admin')
  adminFindAll(
    @MongoQuery() query: MongoQueryModel,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.wordService.adminFindAll(query, paginationDto);
  }

  @SwaggerFindWordDoc()
  @Get('/')
  @UseGuards(ClerkAuthGuard)
  findAll(
    @MongoQuery() query: MongoQueryModel,
    @Query() paginationDto: PaginationDto,
    @GetLanguage() language: string,
  ) {
    return this.wordService.findAll(query, paginationDto, language);
  }
}
