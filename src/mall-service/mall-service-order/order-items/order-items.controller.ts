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

@Controller('order-items')
export class OrderItemsController {
  @Inject(OrderItemsService)
  private orderItemsService: OrderItemsService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() orderItem: OrderItemsEntity,
  ) {
    return this.orderItemsService.findList({ current, pageSize }, orderItem);
  }

  @Post('/add')
  add(@Body() body: any) {
    return this.orderItemsService.add(body);
  }

  @Get('/:id')
  async getSpecById(@Param('id') id: string) {
    return this.orderItemsService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() spec: OrderItemsEntity) {
    return this.orderItemsService.update(id, spec);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.orderItemsService.remove(id);
  }

  @Get()
  async findAll() {
    return this.orderItemsService.findAll();
  }
}
