import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './entitys/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dtos/role.dto';
import Result from '../../../common/utils/Result';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Result<RoleEntity>> {
    const data: RoleEntity = await this.roleRepository.create(createRoleDto);
    return new Result(data);
  }

  async findAll(): Promise<Result<RoleEntity[]>> {
    const data = await this.roleRepository.find();
    return new Result(data);
  }

  async findOne(id: number): Promise<Result<RoleEntity>> {
    const data = await this.roleRepository.findOneBy({ id });
    return new Result(data);
  }

  async findRolesByRoleIds(ids: number[]): Promise<Result<RoleEntity[]>> {
    const data = await this.roleRepository.findBy({
      id: In(ids),
    });
    return new Result(data);
  }

  async remove(id: number) {
    const data = await this.roleRepository.delete(id);
    return new Result(data, '删除成功');
  }
}
