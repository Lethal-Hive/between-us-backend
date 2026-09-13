import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './entities/word.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
    UserModule,
    CategoryModule,
  ],
  controllers: [WordController],
  providers: [WordService],
  exports: [WordService],
})
export class WordModule {}
