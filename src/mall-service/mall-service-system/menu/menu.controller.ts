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
import { Menu } from './entitys/menu.entity';
import { MenuService } from './menu.service';
import { RoleEntity } from '../role/entitys/role.entity';

@Permission('admin')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() orderItem: RoleEntity,
  ) {
    return this.menuService.findList({ current, pageSize }, orderItem);
  }

  @Get()
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  getRoleById(@Param() id: number) {
    return this.menuService.findOne(id);
  }

  @Post()
  create(@Body() menu: Menu) {
    return this.menuService.create(menu);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() sysUser: Menu) {
    return this.menuService.update(id, sysUser);
  }

  @Delete(':id')
  deleteRoleById(@Param() id: number) {
    return this.menuService.remove(id);
  }
}
