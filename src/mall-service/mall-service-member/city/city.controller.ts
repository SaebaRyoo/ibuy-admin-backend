import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CityEntity } from './city.entity';

@Controller('city')
export class CityController {
  @Inject(CityService)
  private cityService: CityService;

  /**
   * 分页+条件查找
   * @param pageParam
   * @param member
   */
  @Post('/list/:current/:pageSize')
  async findList(
    @Body('pageParam') pageParam: any,
    @Body('conditions') member: CityEntity,
  ) {
    return await this.cityService.findList(pageParam, member);
  }

  /**
   * 添加
   * @param body
   */
  @Post('/add')
  add(@Body() body: CityEntity) {
    return this.cityService.add(body);
  }

  /**
   * 根据id查找
   * @param id
   */
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return this.cityService.findById(id);
  }

  /**
   * 根据id更新
   * @param id
   * @param member
   */
  @Patch('/:id')
  update(@Param('id') id: string, @Body() member: CityEntity) {
    return this.cityService.update(id, member);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.cityService.remove(id);
  }

  @Get()
  async findAll() {
    return this.cityService.findAll();
  }
}
