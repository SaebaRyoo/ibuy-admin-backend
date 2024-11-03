import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaEntity } from './area.entity';

@Controller('area')
export class AreaController {
  @Inject(AreaService)
  private areaService: AreaService;

  /**
   * 分页+条件查找
   * @param pageParam
   * @param member
   */
  @Post('/list')
  async findList(
    @Body('pageParam') pageParam: any,
    @Body('conditions') member: AreaEntity,
  ) {
    return await this.areaService.findList(pageParam, member);
  }

  /**
   * 添加
   * @param body
   */
  @Post('/add')
  add(@Body() body: AreaEntity) {
    return this.areaService.add(body);
  }

  /**
   * 根据id查找
   * @param id
   */
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.areaService.findById(id);
  }

  /**
   * 根据id更新
   * @param id
   * @param member
   */
  @Patch('/:id')
  update(@Param('id') id: string, @Body() member: AreaEntity) {
    return this.areaService.update(id, member);
  }
}
