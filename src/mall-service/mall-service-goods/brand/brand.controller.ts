import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandEntity } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
  @Inject(BrandService)
  private brandService: BrandService;

  @Get('/category/:category_id')
  async findBrandByCategoryId(
    @Param('category_id', ParseIntPipe) category_id: number,
  ) {
    return this.brandService.findBrandByCategoryId(category_id);
  }

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current', ParseIntPipe) current: number,
    @Param('pageSize', ParseIntPipe) pageSize: number,
    @Body() brand: BrandEntity,
  ) {
    return this.brandService.findList({ current, pageSize }, brand);
  }

  @Post()
  create(@Body() body: CreateBrandDto) {
    return this.brandService.add(body);
  }

  @Get('/:id')
  async getBrandById(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: BrandEntity) {
    return this.brandService.update(id, para);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.brandService.remove(id);
  }

  @Get()
  async findAll() {
    return this.brandService.findAll();
  }
}
