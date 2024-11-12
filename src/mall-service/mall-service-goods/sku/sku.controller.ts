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
import { SkuService } from './sku.service';
import { SkuEntity } from './sku.entity';
import { Public } from '../../../common/decorators/metadata/public.decorator';

@Controller('sku')
export class SkuController {
  @Inject(SkuService)
  private skuService: SkuService;

  @Public()
  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() sku: SkuEntity,
  ) {
    return await this.skuService.findList({ current, pageSize }, sku);
  }

  @Post()
  createSku(@Body() body: any) {
    return this.skuService.addSku(body);
  }

  @Get('/:id')
  async getSkuById(@Param('id') id: string) {
    return this.skuService.findById(id);
  }

  @Patch('/:id')
  updateSku(@Param('id') id: string, @Body() sku: SkuEntity) {
    return this.skuService.updateSku(id, sku);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.skuService.remove(id);
  }

  @Get()
  async findAll() {
    return this.skuService.findAll();
  }

  /**
   * 根据spu id查询sku数据
   * @param spuId
   * @return
   */
  @Get('/spu/:spuId')
  async findBySpuId(@Param('spuId') spuId: string) {
    return this.skuService.findBySpuId(spuId);
  }
}
