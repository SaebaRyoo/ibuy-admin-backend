import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParaService } from './para.service';
import { ParaEntity } from './para.entity';

@Controller('para')
export class ParaController {
  @Inject(ParaService)
  private paraService: ParaService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() para: ParaEntity,
  ) {
    return await this.paraService.findList({ current, pageSize }, para);
  }

  @Post('/add')
  create(@Body() body: any) {
    return this.paraService.add(body);
  }

  @Get('/:id')
  async getParaById(@Param('id') id: number) {
    return this.paraService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: ParaEntity) {
    return this.paraService.update(id, para);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.paraService.remove(id);
  }

  @Get()
  async findAll() {
    return this.paraService.findAll();
  }
}
