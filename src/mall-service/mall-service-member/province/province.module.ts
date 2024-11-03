import { Global, Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './province.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProvinceEntity])],
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [ProvinceService],
})
export class ProvinceModule {}
