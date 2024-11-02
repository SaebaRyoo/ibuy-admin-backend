import { Global, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), ConfigModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
