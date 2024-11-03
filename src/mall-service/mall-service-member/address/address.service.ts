import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from './address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions, {
  PageParam,
} from '../../../common/utils/findWithConditions';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}
  async findList(
    pageParma: PageParam,
    conditions: AddressEntity,
  ): Promise<Result<{ data: AddressEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.addressRepository,
      conditions,
      pageParma,
      'city',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.addressRepository.findOneBy({ id });

    return new Result(data);
  }

  async add(member: AddressEntity) {
    const data = await this.addressRepository.insert(member);
    return new Result(data);
  }

  async update(id: string, member: AddressEntity) {
    const data = await this.addressRepository
      .createQueryBuilder()
      .update(AddressEntity)
      .set(member)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.addressRepository.delete(id);
    return new Result(null);
  }
}
