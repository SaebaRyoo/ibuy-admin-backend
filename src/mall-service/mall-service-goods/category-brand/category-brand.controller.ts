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
import { CategoryBrandService } from './category-brand.service';
import { CategoryBrandEntity } from './category-brand.entity';
import { AddressEntity } from '../../mall-service-member/address/address.entity';

@Controller('categoryBrand')
export class CategoryBrandController {
  @Inject(CategoryBrandService)
  private categoryBrandService: CategoryBrandService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() categoryBrand: CategoryBrandEntity,
  ) {
    return this.categoryBrandService.findList(
      { current, pageSize },
      categoryBrand,
    );
  }

  @Post('/add')
  async createTemplate(@Body() body: any) {
    return this.categoryBrandService.addTemplate(body);
  }

  @Get('/:id')
  async getTemplateById(@Param('id') id: number) {
    return this.categoryBrandService.findById(id);
  }

  @Patch('/:id')
  updateTemplate(
    @Param('id') id: number,
    @Body() template: CategoryBrandEntity,
  ) {
    return this.categoryBrandService.updateTemplate(id, template);
  }
}
