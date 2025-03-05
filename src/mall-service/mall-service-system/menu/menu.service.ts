import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entitys/menu.entity';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(menuData: Partial<Menu>) {
    const menu = await this.menuRepository.create(menuData);
    return new Result(menu);
  }
  async update(id: number, role: Menu) {
    const data = await this.menuRepository.update(id, role);
    return new Result(data);
  }

  async findAll() {
    const data = await this.menuRepository.find();
    return new Result(data);
  }

  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.menuRepository,
      conditions,
      pageParma,
      'menu',
    );
    return new Result({ data, total });
  }

  async findOne(id: number) {
    const data = await this.menuRepository.findOneById(id);
    return new Result(data);
  }

  async remove(id: number) {
    const data = await this.menuRepository.delete(id);
    return new Result(data, '删除成功');
  }
}
