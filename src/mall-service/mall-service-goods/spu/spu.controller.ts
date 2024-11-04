import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SpuService } from './spu.service';
import { SpuEntity } from './spu.entity';
import { GoodsType } from './goods.type';

@Controller('spu')
export class SpuController {
  @Inject(SpuService)
  private spuService: SpuService;

  @Put('/put/many')
  async putMany(@Body() ids: string[]) {
    return this.spuService.putMany(ids);
  }

  @Put('/put/:id')
  async put(@Param('id') id: string) {
    return this.spuService.put(id);
  }

  @Put('/pull/many')
  async pullMany(@Body() ids: string[]) {
    return this.spuService.pullMany(ids);
  }

  @Put('/pull/:id')
  async pull(@Param('id') id: string) {
    return this.spuService.pull(id);
  }

  @Put('/audit/:id')
  async audit(@Param('id') id: string) {
    return this.spuService.audit(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return this.spuService.restore(id);
  }
  @Delete('/logic/delete/:id')
  async logicDelete(@Param('id') id: string) {
    return this.spuService.logicDelete(id);
  }

  @Post('/save')
  async saveGoods(@Body() goods: GoodsType) {
    return this.spuService.saveGoods(goods);
  }

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() spu: SpuEntity,
  ) {
    return this.spuService.findList({ current, pageSize }, spu);
  }

  @Post('/add')
  create(@Body() body: any) {
    return this.spuService.add(body);
  }

  @Get('/:id')
  async getParaById(@Param('id') id: string) {
    return this.spuService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: SpuEntity) {
    return this.spuService.update(id, para);
  }
}
