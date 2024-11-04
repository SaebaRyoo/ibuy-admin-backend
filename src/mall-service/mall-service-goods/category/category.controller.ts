import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { AddressEntity } from '../../mall-service-member/address/address.entity';

@Controller('category')
export class CategoryController {
  @Inject(CategoryService)
  private categoryService: CategoryService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() category: CategoryEntity,
  ) {
    return this.categoryService.findList({ current, pageSize }, category);
  }

  @Post('/add')
  create(@Body() body: any) {
    return this.categoryService.add(body);
  }

  @Get('/:id')
  async getParaById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: CategoryEntity) {
    return this.categoryService.update(id, para);
  }
}
