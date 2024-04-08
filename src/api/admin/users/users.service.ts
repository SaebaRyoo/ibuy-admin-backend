import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

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

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
