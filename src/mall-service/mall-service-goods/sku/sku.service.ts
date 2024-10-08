import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SkuEntity } from './sku.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(SkuEntity)
    private skuRepository: Repository<SkuEntity>,
  ) {}
  async findList(pageParma: any): Promise<[SkuEntity[], number]> {
    const qb = this.skuRepository
      .createQueryBuilder('para')
      .skip(pageParma.pageSize * (pageParma.current - 1))
      .limit(pageParma.pageSize);
    return await qb.getManyAndCount();
  }

  async findById(id: string) {
    return this.skuRepository.findBy({ id });
  }

  addPara(para: SkuEntity) {
    return this.skuRepository.insert(para);
  }

  async updatePara(id: number, para: SkuEntity) {
    return this.skuRepository
      .createQueryBuilder()
      .update(SkuEntity)
      .set(para)
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    await this.skuRepository.delete(id);
  }
}
