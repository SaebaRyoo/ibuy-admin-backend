import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Permission } from 'src/common/decorators/metadata/permission.decorator';
import { SysUsersEntity } from './entitys/sys-user.entity';
import { UsersService } from './sys-user.service';
import { RoleEntity } from '../role/entitys/role.entity';

@Permission('admin')
@Controller('sys-user')
export class SysUserController {
  constructor(private userService: UsersService) {}

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() orderItem: RoleEntity,
  ) {
    return this.userService.findList({ current, pageSize }, orderItem);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getRoleById(@Param() id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: SysUsersEntity) {
    return this.userService.create(user);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() sysUser: SysUsersEntity) {
    return this.userService.update(id, sysUser);
  }

  @Delete(':id')
  deleteRoleById(@Param() id: number) {
    return this.userService.remove(id);
  }
}
