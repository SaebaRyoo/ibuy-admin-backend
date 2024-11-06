import { Get, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemplateEntity } from './template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templateRepository: Repository<TemplateEntity>,
  ) {}

  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.templateRepository,
      conditions,
      pageParma,
      'template',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.templateRepository.findOneBy({ id });
    return new Result(data);
  }

  async addTemplate(template: TemplateEntity) {
    const data = await this.templateRepository.insert(template);
    return new Result(data);
  }

  async updateTemplate(id: number, template: TemplateEntity) {
    const data = await this.templateRepository.update(id, template);
    return new Result(data);
  }

  async remove(id: number) {
    await this.templateRepository.delete(id);
    return new Result(null);
  }

  @Get()
  async findAll() {
    return this.templateRepository.find();
  }
}
