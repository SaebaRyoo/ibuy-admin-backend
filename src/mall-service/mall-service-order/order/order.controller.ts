import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { BrandEntity } from '../../mall-service-goods/brand/brand.entity';

@Controller('order')
export class OrderController {
  @Inject(OrderService)
  private orderService: OrderService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() order: OrderEntity,
  ) {
    return this.orderService.findList({ current, pageSize }, order);
  }
  @Get('/:id')
  async getSpecById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() spec: OrderEntity) {
    return this.orderService.update(id, spec);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }
}
