import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRoleEntity } from './users-role.entity';
import Result from '../../../common/utils/Result';

@Injectable()
export class UsersRoleService {
  constructor(
    @InjectRepository(UsersRoleEntity)
    private usersRoleRepository: Repository<UsersRoleEntity>,
  ) {}

  async findAll(): Promise<Result<UsersRoleEntity[]>> {
    const data = await this.usersRoleRepository.find();
    return new Result(data);
  }

  async findRolesIdByUserId(admin_id: number) {
    const rolesOfUser = await this.usersRoleRepository.findBy({ admin_id });
    const data = rolesOfUser.map((item) => item.role_id);
    return new Result(data);
  }

  async add(userRole: UsersRoleEntity) {
    const data = await this.usersRoleRepository.insert(userRole);
    return new Result(data);
  }

  async update(id: number, userRole: UsersRoleEntity) {
    const data = await this.usersRoleRepository.update(id, userRole);
    return new Result(data);
  }

  async remove(id: number) {
    await this.usersRoleRepository.delete(id);
    return new Result(null);
  }
}
