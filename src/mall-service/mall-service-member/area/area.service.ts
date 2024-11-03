import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AreaEntity } from './area.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions, {
  PageParam,
} from '../../../common/utils/findWithConditions';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
  ) {}
  async findList(
    pageParma: PageParam,
    conditions: AreaEntity,
  ): Promise<Result<{ data: AreaEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.areaRepository,
      conditions,
      pageParma,
      'city',
    );
    return new Result({ data, total });
  }

  async findById(id: string) {
    const data = await this.areaRepository.findOneBy({ areaId: id });

    return new Result(data);
  }

  async add(member: AreaEntity) {
    const data = await this.areaRepository.insert(member);
    return new Result(data);
  }

  async update(id: string, member: AreaEntity) {
    const data = await this.areaRepository
      .createQueryBuilder()
      .update(AreaEntity)
      .set(member)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.areaRepository.delete(id);
    return new Result(null);
  }
}
