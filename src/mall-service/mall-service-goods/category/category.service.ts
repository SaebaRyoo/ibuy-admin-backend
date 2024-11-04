import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findList(
    pageParma: any,
    conditions,
  ): Promise<Result<{ data: CategoryEntity[]; total: number }>> {
    const [data, total] = await findWithConditions(
      this.categoryRepository,
      conditions,
      pageParma,
      'category',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.categoryRepository.findOneBy({ id });
    return new Result(data);
  }

  async add(para: CategoryEntity) {
    const data = await this.categoryRepository.insert(para);
    return new Result(data);
  }

  async update(id: number, para: CategoryEntity) {
    const data = await this.categoryRepository
      .createQueryBuilder()
      .update(CategoryEntity)
      .set(para)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.categoryRepository.delete(id);
    return new Result(null);
  }
}
