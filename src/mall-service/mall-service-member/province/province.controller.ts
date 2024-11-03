import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceEntity } from './province.entity';

@Controller('province')
export class ProvinceController {
  @Inject(ProvinceService)
  private provinceService: ProvinceService;

  /**
   * 分页查找省份列表
   * @param pageParam
   * @param member
   */
  @Post('/list')
  async findList(
    @Body('pageParam') pageParam: any,
    @Body('conditions') member: ProvinceEntity,
  ) {
    return await this.provinceService.findList(pageParam, member);
  }

  /**
   * 添加省份
   * @param body
   */
  @Post('/add')
  add(@Body() body: ProvinceEntity) {
    return this.provinceService.add(body);
  }

  /**
   * 根据id查找
   * @param id
   */
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.provinceService.findById(id);
  }

  /**
   * 根据id更新
   * @param id
   * @param member
   */
  @Patch('/:id')
  update(@Param('id') id: string, @Body() member: ProvinceEntity) {
    return this.provinceService.update(id, member);
  }
}
