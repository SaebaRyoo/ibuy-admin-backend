import { Global, Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaEntity } from './area.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  providers: [AreaService],
  controllers: [AreaController],
  exports: [AreaService],
})
export class AreaModule {}
