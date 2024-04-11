import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { RoleEntity } from './entitys/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dtos/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<void> {
    await this.roleRepository.create(createRoleDto);
  }

  findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  findOne(id: number): Promise<RoleEntity | null> {
    return this.roleRepository.findOneBy({ id });
  }

  findRolesByRoleIds(ids: number[]): Promise<RoleEntity[] | null> {
    return this.roleRepository.findBy({
      id: In(ids),
    });
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
