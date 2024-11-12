import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';

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
  async getById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  /**
   * 根据父节点id查询分类
   * @param pid
   */
  @Get('/list/:pid')
  async findByParentId(@Param('pid') pid: number) {
    return this.categoryService.findByParentId(pid);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: CategoryEntity) {
    return this.categoryService.update(id, para);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }
}
