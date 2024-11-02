import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entitys/users.entity';
import * as bcrypt from 'bcrypt';
import Result from '../../../common/utils/Result';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Result<Users[]>> {
    const data = await this.usersRepository.find();
    return new Result(data);
  }

  async findOne(login_name: string) {
    const data = await this.usersRepository.findOneBy({ login_name });
    return new Result(data);
  }

  async create(data: Users) {
    const _data = { ...data };

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(_data.password, saltOrRounds);

    _data.password = hash;

    const result = await this.usersRepository.insert(_data);
    return new Result(result);
  }

  async remove(id: number) {
    const data = await this.usersRepository.delete(id);
    return new Result(data, '删除成功');
  }
}
