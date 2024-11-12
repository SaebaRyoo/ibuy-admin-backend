import { Get, Injectable } from '@nestjs/common';
import { InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';
import findWithConditions, {
  PageParam,
} from '../../../common/utils/findWithConditions';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(ProvinceEntity)
    private provinceRepository: Repository<ProvinceEntity>,
  ) {}
  async findList(
    pageParma: PageParam,
    member: ProvinceEntity,
  ): Promise<Result<{ data: ProvinceEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.provinceRepository,
      member,
      pageParma,
      'member',
    );
    return new Result({ data, total });
  }

  async findById(id: string) {
    const data = await this.provinceRepository.findOneBy({ provinceId: id });

    return new Result(data);
  }

  async add(member: ProvinceEntity) {
    const data = await this.provinceRepository.insert(member);
    return new Result(data);
  }

  async update(id: string, member: ProvinceEntity) {
    const data = await this.provinceRepository
      .createQueryBuilder()
      .update(ProvinceEntity)
      .set(member)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.provinceRepository.delete(id);
    return new Result(null);
  }

  @Get()
  async findAll() {
    const data = await this.provinceRepository.find();
    return new Result(data);
  }
}
