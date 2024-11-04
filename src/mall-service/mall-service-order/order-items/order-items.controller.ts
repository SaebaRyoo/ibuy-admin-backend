import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsEntity } from './entities/order-items.entity';
import { BrandEntity } from '../../mall-service-goods/brand/brand.entity';

@Controller('order-items')
export class OrderItemsController {
  @Inject(OrderItemsService)
  private orderService: OrderItemsService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() orderItem: OrderItemsEntity,
  ) {
    return this.orderService.findList({ current, pageSize }, orderItem);
  }

  @Post('/add')
  add(@Body() body: any) {
    return this.orderService.add(body);
  }

  @Get('/:id')
  async getSpecById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() spec: OrderItemsEntity) {
    return this.orderService.update(id, spec);
  }
}
