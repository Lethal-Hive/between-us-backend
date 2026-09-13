import { Injectable } from '@nestjs/common';
import { InjectDatabaseModel } from 'src/utils/mongoose.utils';
import {
  Staff,
  StaffModel,
  StaffParametersType,
} from './entities/staff.entity';
import { AnyKeys, FilterQuery } from 'mongoose';
import { CreateStaffDto } from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectDatabaseModel(Staff.name) private readonly staffModel: StaffModel,
  ) {}

  findOne(query: FilterQuery<StaffParametersType>) {
    return this.staffModel.findOne({
      deletedAt: { $exists: false },
      ...query,
    });
  }

  create(data: AnyKeys<StaffParametersType>) {
    return this.staffModel.create(data);
  }

  createStaff(createStaffDto: CreateStaffDto) {
    return this.staffModel.create(createStaffDto);
  }

  async deleteStaff(_id: string) {
    const deleteStaff = await this.staffModel.deleteOne({
      _id,
    });

    if (deleteStaff.deletedCount > 0)
      return {
        message: 'Staff deleted successfully',
      };
  }
}
