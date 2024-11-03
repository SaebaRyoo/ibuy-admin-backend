import { Injectable } from '@nestjs/common';
import { InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { MemberEntity } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}
  async findList(
    pageParma: any,
    member: MemberEntity,
  ): Promise<Result<{ data: MemberEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.memberRepository,
      member,
      pageParma,
      'member',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.memberRepository.findOneBy({ id });

    return new Result(data);
  }

  async add(member: MemberEntity) {
    const saltOrRounds = 10;
    member.password = await bcrypt.hash(member.password, saltOrRounds);

    const result: InsertResult = await this.memberRepository.insert(member);
    return new Result(result);
  }

  async update(id: string, member: MemberEntity) {
    const data = await this.memberRepository
      .createQueryBuilder()
      .update(MemberEntity)
      .set(member)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.memberRepository.delete(id);
    return new Result(null);
  }
}
