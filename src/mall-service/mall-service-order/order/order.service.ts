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
    const data = await this.orderRepository.findOneBy({ id });
    return new Result(data);
  }

  async update(id: number, spec: OrderEntity) {
    const data = await this.orderRepository
      .createQueryBuilder()
      .update(OrderEntity)
      .set(spec)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    const data = await this.orderRepository.delete(id);
    return new Result(data);
  }

  @Get()
  async findAll() {
    const data = await this.orderRepository.find();
    return new Result(data);
  }
}
