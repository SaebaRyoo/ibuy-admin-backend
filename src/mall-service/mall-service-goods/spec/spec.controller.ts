import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SpecService } from './spec.service';
import { SpecEntity } from './spec.entity';
import { AddressEntity } from '../../mall-service-member/address/address.entity';

@Controller('spec')
export class SpecController {
  @Inject(SpecService)
  private specService: SpecService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() spec: SpecEntity,
  ) {
    return this.specService.findList({ current, pageSize }, spec);
  }

  @Post('/add')
  createSpec(@Body() body: any) {
    return this.specService.addSpec(body);
  }

  @Get('/:id')
  async getSpecById(@Param('id') id: number) {
    return this.specService.findById(id);
  }

  @Patch('/:id')
  updateSpec(@Param('id') id: number, @Body() spec: SpecEntity) {
    return this.specService.updateSpec(id, spec);
  }
}
