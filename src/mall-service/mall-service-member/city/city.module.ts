import { Global, Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
