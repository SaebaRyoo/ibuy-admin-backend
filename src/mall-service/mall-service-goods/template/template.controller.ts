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
import { TemplateService } from './template.service';
import { TemplateEntity } from './template.entity';
import { AddressEntity } from '../../mall-service-member/address/address.entity';

@Controller('template')
export class TemplateController {
  @Inject(TemplateService)
  private templateService: TemplateService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() template: TemplateEntity,
  ) {
    return this.templateService.findList({ current, pageSize }, template);
  }

  @Post()
  async createTemplate(@Body() body: any) {
    return this.templateService.addTemplate(body);
  }

  @Get('/:id')
  async getTemplateById(@Param('id') id: number) {
    return this.templateService.findById(id);
  }

  @Patch('/:id')
  updateTemplate(@Param('id') id: number, @Body() template: TemplateEntity) {
    return this.templateService.updateTemplate(id, template);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.templateService.remove(id);
  }

  @Get()
  async findAll() {
    return this.templateService.findAll();
  }
}
