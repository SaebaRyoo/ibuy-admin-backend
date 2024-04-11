import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { RoleEntity } from '../role/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(login_name: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ login_name });
  }

  // findRolesByUserId(user_id: number): Promise<RoleEntity | null> {
  //   return
  // }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
