import { Get, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SpecEntity } from './spec.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class SpecService {
  constructor(
    @InjectRepository(SpecEntity)
    private specRepository: Repository<SpecEntity>,
  ) {}

  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.specRepository,
      conditions,
      pageParma,
      'spec',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.specRepository.findOneBy({ id });
    return new Result(data);
  }

  async addSpec(spec: SpecEntity) {
    const data = await this.specRepository.insert(spec);
    return new Result(data);
  }

  async updateSpec(id: number, spec: SpecEntity) {
    const data = await this.specRepository
      .createQueryBuilder()
      .update(SpecEntity)
      .set(spec)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.specRepository.delete(id);
    return new Result(null);
  }

  @Get()
  async findAll() {
    return this.specRepository.find();
  }
}
