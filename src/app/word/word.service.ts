import { Injectable } from '@nestjs/common';
import {
  InjectDatabaseModel,
  PaginationDto,
  sanitizeAggregationPipeline,
} from 'src/utils/mongoose.utils';
import { Word, WordModel, WordParametersType } from './entities/word.entity';
import { FilterQuery, PipelineStage } from 'mongoose';
import { CreateWordDto, EditWordDto } from './dto/word.dto';
import { MongoQueryModel } from 'src/utils/mongo-query.utils';
import { CategoryService } from '../category/category.service';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class WordService {
  constructor(
    @InjectDatabaseModel(Word.name) private wordModel: WordModel,
    @InjectConnection() private readonly connection,
    private categoryService: CategoryService,
  ) {
    // this.wordModel.insertMany([
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Airplane', ar: 'طيارة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Airport', ar: 'المطار' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Passport', ar: 'جواز سفر' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Ticket', ar: 'تذكرة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Backpack', ar: 'شنطة ضهر' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Hotel', ar: 'فندق' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Room', ar: 'أوضة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Reservation', ar: 'حجز' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Reception', ar: 'الاستقبال' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Holiday', ar: 'عطلة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Map', ar: 'خريطة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Compass', ar: 'بوصلة' },
    //     isNSFW: false,
    //     difficulty: 'medium',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Taxi', ar: 'تاكسي' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Bus', ar: 'أوتوبيس' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Train', ar: 'قطر' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Car rental', ar: 'تأجير عربية' },
    //     isNSFW: false,
    //     difficulty: 'medium',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Driver', ar: 'سواق' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Road', ar: 'طريق' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Highway', ar: 'طريق سريع' },
    //     isNSFW: false,
    //     difficulty: 'medium',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Gate', ar: 'بوابة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     category: '69d18855c5158cc5d0bf2317',
    //     name: { en: 'Tour', ar: 'جولة' },
    //     isNSFW: false,
    //     difficulty: 'easy',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  }

  findOne(query: FilterQuery<WordParametersType>) {
    return this.wordModel.findOne(query);
  }

  aggregate(pipeline: PipelineStage[]) {
    return this.wordModel.aggregate(pipeline);
  }
  async create(createWordDto: CreateWordDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.wordModel.create(createWordDto);
      if (createWordDto.category) {
        const category = await this.categoryService.findOne({
          _id: createWordDto.category,
        });
        if (category) {
          category.wordsCount += 1;
          if (createWordDto.isNSFW) {
            category.wordsNFSWCount += 1;
          }
          await category.save();
        }
      }
      await session.commitTransaction();
    } catch {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  edit(_id: string, editWordDto: EditWordDto) {
    return this.wordModel.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: editWordDto,
      },
      {
        new: true,
      },
    );
  }

  adminFindAll(query: MongoQueryModel, paginationDto: PaginationDto) {
    return sanitizeAggregationPipeline(this.wordModel, query, paginationDto, {
      additionalStages: [
        {
          $project: {
            _id: 1,
            name: 1,
            isNSFW: 1,
            difficulty: 1,
          },
        },
      ],
    });
  }

  findAll(
    query: MongoQueryModel,
    paginationDto: PaginationDto,
    language: string,
  ) {
    return sanitizeAggregationPipeline(this.wordModel, query, paginationDto, {
      additionalStages: [
        {
          $project: {
            _id: 1,
            name: `$name.${language}`,
            isNSFW: 1,
            difficulty: 1,
          },
        },
      ],
    });
  }
}
