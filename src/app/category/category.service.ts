import { Injectable } from '@nestjs/common';
import {
  InjectDatabaseModel,
  PaginationDto,
  sanitizeAggregationPipeline,
} from 'src/utils/mongoose.utils';
import {
  Category,
  CategoryModel,
  CategoryParametersType,
} from './entities/category.entity';
import { MongoQueryModel } from 'src/utils/mongo-query.utils';
import { CreateCategoryDto, EditCategoryDto } from './dto/category.dto';
import { FilterQuery, PipelineStage } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectDatabaseModel(Category.name) private categoryModel: CategoryModel,
  ) {}

  aggregate(pipeline: PipelineStage[]) {
    return this.categoryModel.aggregate(pipeline);
  }

  findOne(query: FilterQuery<CategoryParametersType>) {
    return this.categoryModel.findOne(query);
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  edit(_id: string, editCategoryDto: EditCategoryDto) {
    return this.categoryModel.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: editCategoryDto,
      },
      {
        new: true,
      },
    );
  }

  adminFindAll(query: MongoQueryModel, paginationDto: PaginationDto) {
    return sanitizeAggregationPipeline(
      this.categoryModel,
      query,
      paginationDto,
      {
        additionalStages: [
          {
            $project: {
              _id: 1,
              name: 1,
              icon: 1,
              wordsCount: 1,
            },
          },
        ],
      },
    );
  }

  findAll(language: string) {
    return this.categoryModel.aggregate([
      {
        $project: {
          _id: 1,
          name: `$name.${language}`,
          icon: 1,
          wordsCount: 1,
        },
      },
    ]);
  }
}
