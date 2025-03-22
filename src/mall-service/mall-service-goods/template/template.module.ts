import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './template.entity';
import { ParaEntity } from '../para/para.entity';
import { SpecEntity } from '../spec/spec.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity, ParaEntity, SpecEntity])],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
