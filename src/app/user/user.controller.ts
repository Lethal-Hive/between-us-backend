import { Body, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User, UserDocument } from './entities/user.entity';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';
import { SetGenderDto } from './dto/user.dto';
import { SwaggerSetGender } from './docs/user.docs';

@SwaggerAuthController('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(ClerkAuthGuard)
  @Serialize(User)
  getMe(@GetUser() user: UserDocument) {
    return user;
  }

  @Patch('/set-gender')
  @UseGuards(ClerkAuthGuard)
  @SwaggerSetGender()
  @Serialize(User)
  setGender(@GetUser() user: UserDocument, @Body() dto: SetGenderDto) {
    return this.userService.setGender(user._id, dto.gender);
  }
}
