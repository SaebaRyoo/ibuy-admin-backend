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
import { SkuService } from './sku.service';
import { SkuEntity } from './sku.entity';

@Controller('sku')
export class SkuController {
  @Inject(SkuService)
  private skuService: SkuService;

  @Post('/list')
  async findList(@Body('pageParam') pageParam: any) {
    const [data, total] = await this.skuService.findList(pageParam);
    return { data, total };
  }

  @Post('/add')
  createPara(@Body() body: any) {
    return this.skuService.addPara(body);
  }

  @Get('/:id')
  async getParaById(@Param('id') id: string) {
    return this.skuService.findById(id);
  }

  @Patch('/:id')
  updatePara(@Param('id') id: number, @Body() para: SkuEntity) {
    return this.skuService.updatePara(id, para);
  }
}
