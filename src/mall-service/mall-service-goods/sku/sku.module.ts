import { Module } from '@nestjs/common';
import { SkuService } from './sku.service';
import { SkuController } from './sku.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkuEntity } from './sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkuEntity])],
  providers: [SkuService],
  controllers: [SkuController],
  exports: [SkuService],
})
export class SkuModule {}
