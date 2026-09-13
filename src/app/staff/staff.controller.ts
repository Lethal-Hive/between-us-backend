import { Body, Delete, Param, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';

import { MongoIdParam } from 'src/utils/mongoose.utils';
import { SwaggerCreateStaff, SwaggerDeleteStaff } from './docs/staff.docs';
import { CreateStaffDto } from './dto/staff.dto';

@SwaggerAuthController('Staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('/staff')
  @SwaggerCreateStaff()
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.createStaff(createStaffDto);
  }

  @Delete('/staff/:id')
  @SwaggerDeleteStaff()
  deleteStaff(@Param() mongoIdParam: MongoIdParam) {
    return this.staffService.deleteStaff(mongoIdParam.id);
  }
}
