import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressEntity } from './address.entity';

@Controller('address')
export class AddressController {
  @Inject(AddressService)
  private addressService: AddressService;

  /**
   * 分页+条件查找
   * @param pageParam
   * @param member
   */
  @Post('/list')
  async findList(
    @Body('pageParam') pageParam: any,
    @Body('conditions') member: AddressEntity,
  ) {
    return await this.addressService.findList(pageParam, member);
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
}
