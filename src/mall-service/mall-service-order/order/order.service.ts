import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { SkuService } from '../../mall-service-goods/sku/sku.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class OrderService {
  constructor(
    @InjectRedis()
    private readonly redisService: Redis,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    private readonly skuService: SkuService,
    private readonly orderItemsService: OrderItemsService,
  ) {}
  async findList(
    pageParma: any,
    conditions,
  ): Promise<Result<{ data: OrderEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.orderRepository,
      conditions,
      pageParma,
      'order',
    );
    return new Result({ data, total });
  }

  async findById(id: string) {
    return this.orderRepository.findOneBy({ id });
  }

  async update(id: number, spec: OrderEntity) {
    return this.orderRepository
      .createQueryBuilder()
      .update(OrderEntity)
      .set(spec)
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  @Get()
  async findAll() {
    return this.orderRepository.find();
  }
}
