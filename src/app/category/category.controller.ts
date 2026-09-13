import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { CategoryService } from './category.service';
import {
  SwaggerAdminFindCategoryDoc,
  SwaggerCreateCategoryDoc,
  SwaggerEditCategoryDoc,
  SwaggerFindCategoryDoc,
} from './docs/category.docs';
import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto, EditCategoryDto } from './dto/category.dto';
import {
  MongoIdParam,
  MongoQuery,
  PaginationDto,
} from 'src/utils/mongoose.utils';
import { MongoQueryModel } from 'src/utils/mongo-query.utils';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';
import { GetLanguage } from 'src/decorators/get-language.decorator';

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzhiMDQwNjUxYzVkMzA3ZDBkMzk1NSIsImlhdCI6MTc3NDkwOTM0NX0.ZGqDJBEXsM4EdDZWinTg8LiS0gh44lVJnlGHqu22pnM

@SwaggerAuthController('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @SwaggerCreateCategoryDoc()
  @Post('/')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @SwaggerEditCategoryDoc()
  @Patch('/:id')
  edit(
    @Body() editCategoryDto: EditCategoryDto,
    @Param() mongoIdParam: MongoIdParam,
  ) {
    return this.categoryService.edit(mongoIdParam.id, editCategoryDto);
  }

  @SwaggerAdminFindCategoryDoc()
  @Get('/admin')
  adminFindAll(
    @MongoQuery() query: MongoQueryModel,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.categoryService.adminFindAll(query, paginationDto);
  }

  @SwaggerFindCategoryDoc()
  @Get('/')
  @UseGuards(ClerkAuthGuard)
  findAll(@GetLanguage() language: string) {
    return this.categoryService.findAll(language);
  }
}
