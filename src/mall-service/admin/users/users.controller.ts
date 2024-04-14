import { Body, Controller, Post } from '@nestjs/common';
import { Permission } from 'src/common/decorators/metadata/permission.decorator';
import { Users } from './entitys/users.entity';
import { UsersService } from './users.service';

@Permission('admin')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() user: Users) {
    const temp = await this.userService.create(user);
    console.log('temp--->', temp);
    return temp;
  }
}
