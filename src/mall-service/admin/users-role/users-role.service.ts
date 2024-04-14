import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRoleEntity } from './users-role.entity';

@Injectable()
export class UsersRoleService {
  constructor(
    @InjectRepository(UsersRoleEntity)
    private usersRoleRepository: Repository<UsersRoleEntity>,
  ) {}

  findAll(): Promise<UsersRoleEntity[]> {
    return this.usersRoleRepository.find();
  }

  async findRolesIdByUserId(admin_id: number): Promise<number[] | null> {
    const data = await this.usersRoleRepository.findBy({ admin_id });
    return data.map((item) => item.role_id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRoleRepository.delete(id);
  }
}
