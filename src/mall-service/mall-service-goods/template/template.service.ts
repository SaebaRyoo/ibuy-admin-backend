import { Get, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemplateEntity } from './template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';
import { ParaEntity } from '../para/para.entity';
import { SpecEntity } from '../spec/spec.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templateRepository: Repository<TemplateEntity>,
    @InjectRepository(ParaEntity)
    private paraRepository: Repository<ParaEntity>,
    @InjectRepository(SpecEntity)
    private specRepository: Repository<SpecEntity>,
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
    const data = await this.templateRepository.find();
    return new Result(data);
  }

  async findParaAndSpecById(id: number) {
    const template = await this.templateRepository.findOneBy({ id });
    if (!template) {
      return new Result(null, '模板不存在');
    }

    const [para, spec] = await Promise.all([
      this.paraRepository.find({ where: { templateId: id } }),
      this.specRepository.find({ where: { templateId: id } })
    ]);

    return new Result({
      template,
      para,
      spec
    });
  }
}
