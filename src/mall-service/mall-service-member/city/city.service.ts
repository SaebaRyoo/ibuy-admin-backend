import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions, {
  PageParam,
} from '../../../common/utils/findWithConditions';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
  ) {}
  async findList(
    pageParma: PageParam,
    conditions: CityEntity,
  ): Promise<Result<{ data: CityEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.cityRepository,
      conditions,
      pageParma,
      'city',
    );
    return new Result({ data, total });
  }

  async findById(id: string) {
    const data = await this.cityRepository.findOneBy({ cityId: id });

    return new Result(data);
  }

  async add(member: CityEntity) {
    const data = await this.cityRepository.insert(member);
    return new Result(data);
  }

  async update(id: string, member: CityEntity) {
    const data = await this.cityRepository
      .createQueryBuilder()
      .update(CityEntity)
      .set(member)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.cityRepository.delete(id);
    return new Result(null);
  }
}
