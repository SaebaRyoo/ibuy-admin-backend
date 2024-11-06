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
import { AddressService } from './address.service';
import { AddressEntity } from './address.entity';
import { SpuEntity } from '../../mall-service-goods/spu/spu.entity';

@Controller('address')
export class AddressController {
  @Inject(AddressService)
  private addressService: AddressService;

  /**
   * 分页+条件查找
   * @param current
   * @param pageSize
   * @param address
   */
  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() address: AddressEntity,
  ) {
    return await this.addressService.findList({ current, pageSize }, address);
  }

  /**
   * 添加
   * @param body
   */
  @Post('/add')
  add(@Body() body: AddressEntity) {
    return this.addressService.add(body);
  }

  /**
   * 根据id查找
   * @param id
   */
  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.addressService.findById(id);
  }

  /**
   * 根据id更新
   * @param id
   * @param member
   */
  @Patch('/:id')
  update(@Param('id') id: string, @Body() member: AddressEntity) {
    return this.addressService.update(id, member);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }

  @Get()
  async findAll() {
    return this.addressService.findAll();
  }
}
