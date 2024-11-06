import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysUsersEntity } from './entitys/sys-user.entity';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(SysUsersEntity)
    private usersRepository: Repository<SysUsersEntity>,
  ) {}

  async findAll(): Promise<Result<SysUsersEntity[]>> {
    const data = await this.usersRepository.find();
    return new Result(data);
  }

  async findByLoginName(loginName: string) {
    const data = await this.usersRepository.findOneBy({ loginName });
    return new Result(data);
  }

  async findOne(id: number): Promise<Result<SysUsersEntity>> {
    const data = await this.usersRepository.findOneBy({ id });
    return new Result(data);
  }

  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.usersRepository,
      conditions,
      pageParma,
      'sys-user',
    );
    return new Result({ data, total });
  }

  async create(data: SysUsersEntity) {
    const _data = { ...data };

    const saltOrRounds = 10;
    _data.password = await bcrypt.hash(_data.password, saltOrRounds);

    const result = await this.usersRepository.insert(_data);
    return new Result(result);
  }

  async update(id: number, user: SysUsersEntity) {
    const _data = { ...user };

    const saltOrRounds = 10;
    _data.password = await bcrypt.hash(_data.password, saltOrRounds);

    const data = await this.usersRepository.update(id, _data);
    return new Result(data);
  }

  async remove(id: number) {
    const data = await this.usersRepository.delete(id);
    return new Result(data, '删除成功');
  }
}
