import { Get, Injectable } from '@nestjs/common';
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

  async findByParentId(pid: number) {
    const data = await this.categoryRepository.findBy({ parentId: pid });
    return new Result(data);
  }

  async add(category: CategoryEntity) {
    const data = await this.categoryRepository.insert(category);
    return new Result(data);
  }

  async update(id: number, category: CategoryEntity) {
    const data = await this.categoryRepository
      .createQueryBuilder()
      .update(CategoryEntity)
      .set(category)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.categoryRepository.delete(id);
    return new Result(null);
  }

  @Get()
  async findAll() {
    const data = await this.categoryRepository.find();
    return new Result(data);
  }
}
