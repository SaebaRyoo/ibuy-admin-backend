import { Get, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { BrandEntity } from './brand.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CategoryBrandEntity } from '../category-brand/category-brand.entity';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,

    @InjectRepository(CategoryBrandEntity)
    private categoryBrandRepository: Repository<CategoryBrandEntity>,

    @InjectDataSource()
    private dataSource,
  ) {}

  // 根据categoryId获取相关品牌列表
  async findBrandByCategoryId(
    categoryId: number,
  ): Promise<Result<{ data: BrandEntity[]; total: number }>> {
    // const brands = await this.dataSource
    //   .createQueryBuilder()
    //   .select(['ib.id', 'ib.name', 'ib.image'])
    //   .from(CategoryBrandEntity, 'icb')
    //   .innerJoin(AlbumEntity, 'ib', 'ib.id = icb.brand_id')
    //   .where('icb.category_id = :categoryId', { categoryId })
    //   .getMany();

    const [data, total] = await this.dataSource
      .query(`SELECT ib.id, name, image FROM ibuy_category_brand icb, ibuy_brand ib WHERE icb.category_id='${categoryId}' AND ib.id=icb.brand_id
`);
    return new Result({ data, total });
  }

  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.brandRepository,
      conditions,
      pageParma,
      'brand',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.brandRepository.findOneBy({ id });
    return new Result(data);
  }

  async add(para: CreateBrandDto) {
    const data = await this.brandRepository.insert(para);
    return new Result(data);
  }

  async update(id: number, para: BrandEntity) {
    const data = await this.brandRepository
      .createQueryBuilder()
      .update(BrandEntity)
      .set(para)
      .where('id = :id', { id })
      .execute();

    return new Result(data);
  }

  @Get()
  async findAll() {
    const data = await this.brandRepository.find();
    return new Result(data);
  }

  async remove(id: number) {
    await this.brandRepository.delete(id);
    return new Result(null);
  }
}
