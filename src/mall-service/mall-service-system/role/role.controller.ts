import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/role.dto';
import { Permission } from 'src/common/decorators/metadata/permission.decorator';
import { RoleEntity } from './entitys/role.entity';

@Permission('admin')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() orderItem: RoleEntity,
  ) {
    return this.roleService.findList({ current, pageSize }, orderItem);
  }

  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  getRoleById(@Param() id: number) {
    return this.roleService.findOne(id);
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() role: RoleEntity) {
    return this.roleService.update(id, role);
  }

  @Delete(':id')
  deleteRoleById(@Param() id: number) {
    return this.roleService.remove(id);
  }
}
