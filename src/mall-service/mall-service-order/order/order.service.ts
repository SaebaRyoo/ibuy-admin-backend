import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { SkuService } from '../../mall-service-goods/sku/sku.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import Result from '../../../common/utils/Result';

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
  ): Promise<Result<{ data: OrderEntity[]; total: number }>> {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .skip(pageParma.pageSize * (pageParma.current - 1))
      .limit(pageParma.pageSize);
    const [data, total] = await qb.getManyAndCount();
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
}
