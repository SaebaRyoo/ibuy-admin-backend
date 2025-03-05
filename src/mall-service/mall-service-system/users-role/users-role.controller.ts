import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersRoleService } from './users-role.service';
import { Permission } from 'src/common/decorators/metadata/permission.decorator';
import { UsersRoleEntity } from './users-role.entity';

@Permission('admin')
@Controller('users-role')
export class UsersRoleController {
  constructor(private usersRoleService: UsersRoleService) {}

  // @Post('/list/:current/:pageSize')
  // async findList(
  //   @Param('current') current: number,
  //   @Param('pageSize') pageSize: number,
  //   @Body() orderItem: UsersRoleEntity,
  // ) {
  //   return this.usersRoleService.findList({ current, pageSize }, orderItem);
  // }

  @Get()
  async findAll() {
    return this.usersRoleService.findAll();
  }

  @Get(':id')
  getRoleById(@Param() id: number) {
    return this.usersRoleService.findRolesIdByUserId(id);
  }

  @Post()
  createRole(@Body() usersRole: UsersRoleEntity) {
    return this.usersRoleService.add(usersRole);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() usersRole: UsersRoleEntity) {
    return this.usersRoleService.update(id, usersRole);
  }

  @Delete(':id')
  deleteRoleById(@Param() id: number) {
    return this.usersRoleService.remove(id);
  }
}
