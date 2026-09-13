/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable } from '@nestjs/common';
import { InjectDatabaseModel } from 'src/utils/mongoose.utils';
import { User, UserModel, UserParametersType } from './entities/user.entity';
import { AnyKeys, FilterQuery } from 'mongoose';
import { I18nService } from 'src/common/i18n/i18n.service';

@Injectable()
export class UserService {
  constructor(
    @InjectDatabaseModel(User.name) private readonly userModel: UserModel,
    private readonly i18n: I18nService,
  ) {}

  findOne(query: FilterQuery<UserParametersType>) {
    return this.userModel.findOne({
      deletedAt: { $exists: false },
      ...query,
    });
  }

  async create(data: AnyKeys<UserParametersType>) {
    return this.userModel.create(data);
  }

  update(
    query: FilterQuery<UserParametersType>,
    update: AnyKeys<UserParametersType>,
    session?: any,
  ) {
    return this.userModel.updateOne(
      {
        deletedAt: { $exists: false },
        ...query,
      },
      update,
      session ? { session } : {},
    );
  }

  async setGender(userId: string, gender: string) {
    await this.update({ _id: userId }, { $set: { gender } });
    return this.findOne({ _id: userId });
  }
}
