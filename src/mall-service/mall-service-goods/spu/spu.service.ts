import { Get, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SpuEntity } from './spu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsType } from './goods.type';
import IDWorker from '../../../common/utils/IDWorker';
import { SkuEntity } from '../sku/sku.entity';
import { CategoryEntity } from '../category/category.entity';
import { BrandEntity } from '../brand/brand.entity';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class SpuService {
  private idWorker: IDWorker;
  constructor(
    @InjectRepository(SpuEntity)
    private spuRepository: Repository<SpuEntity>,

    @InjectRepository(SkuEntity)
    private skuRepository: Repository<SkuEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
  ) {
    this.idWorker = new IDWorker(1n, 1n);
  }

  /***
   * 批量上架
   * @param ids:需要上架的商品ID集合
   * @return
   */
  async putMany(ids: string[]) {
    // 1. 根据传入的ids数组批量修改spu的isMarketable='1'
    // 2. 并且要满足isMarketable='0' status='1' isDelete='0'
    const data = await this.spuRepository
      .createQueryBuilder()
      .update(SpuEntity)
      .set({ isMarketable: '1' })
      .where('id IN (:...ids)', { ids })
      .andWhere('isMarketable = :isMarketable', { isMarketable: '0' })
      .andWhere('status = :status', { status: '1' })
      .andWhere('isDelete = :isDelete', { isDelete: '0' })
      .execute();
    return new Result(data);
  }

  /***
   * 批量下架
   * @param ids:需要上架的商品ID集合
   * @return
   */
  async pullMany(ids: string[]) {
    const data = await this.spuRepository
      .createQueryBuilder()
      .update(SpuEntity)
      .set({ isMarketable: '0' })
      .where('id IN (:...ids)', { ids })
      .andWhere('isMarketable = :isMarketable', { isMarketable: '1' })
      .andWhere('status = :status', { status: '1' })
      .andWhere('isDelete = :isDelete', { isDelete: '0' })
      .execute();
    return new Result(data);
  }

  /***
   * 商品上架
   * @param spuId
   */
  async put(spuId) {
    const data = await this.spuRepository
      .createQueryBuilder('spu')
      .update(SpuEntity)
      .set({ isMarketable: '1' })
      .where('id = :spuId', { spuId })
      .andWhere('isMarketable = :isMarketable', { isMarketable: '0' })
      .andWhere('status = :status', { status: '1' })
      .andWhere('isDelete = :isDelete', { isDelete: '0' })
      .execute();
    return new Result(data);
  }

  /***
   * 商品下架
   * @param spuId
   */
  async pull(spuId) {
    const data = await this.spuRepository
      .createQueryBuilder('spu')
      .update(SpuEntity)
      .set({ isMarketable: '0' })
      .where('id = :spuId', { spuId })
      .andWhere('isMarketable = :isMarketable', { isMarketable: '1' })
      .andWhere('status = :status', { status: '1' })
      .andWhere('isDelete = :isDelete', { isDelete: '0' })
      .execute();
    return new Result(data);
  }

  /**
   * 商品审核
   * @param spuId
   */
  async audit(spuId: string) {
    const data = await this.spuRepository
      .createQueryBuilder('spu')
      .update(SpuEntity)
      .set({ isMarketable: '1', status: '1' })
      .where('id = :spuId', { spuId })
      .andWhere('isDelete = :isDelete', { isDelete: '0' })
      .execute();
    return new Result(data);
  }

  /**
   * 恢复被逻辑删除的数据
   * @param spuId
   */
  async restore(spuId: string) {
    const data = await this.spuRepository
      .createQueryBuilder('spu')
      .update(SpuEntity)
      .set({ status: '0', isDelete: '0' })
      .where('id = :spuId', { spuId })
      .andWhere('isDelete = :isDelete', { isDelete: '1' })
      .execute();
    return new Result(data);
  }

  /**
   * 逻辑删除商品
   * @param spuId
   */
  async logicDelete(spuId: string) {
    const data = await this.spuRepository
      .createQueryBuilder('spu')
      .update(SpuEntity)
      .set({ status: '0', isDelete: '1' })
      .where('id = :spuId', { spuId })
      .andWhere('isMarketable = :isMarketable', { isMarketable: '0' })
      .execute();
    return new Result(data);
  }

  /**
   * 添加goods/更新goods，区别在于是否传入了spu表的id
   *
   * @param goods
   * @return
   */
  async saveGoods(goods: GoodsType) {
    const spu = goods.spu;

    // const idWorker = new IDWorker(1n, 1n);
    //为空则是新增，否则是修改
    if (!spu.id) {
      spu.id = this.idWorker.nextId().toString();
      //将用户传来的goods.spu部分存储到spu表中
      await this.spuRepository.insert(spu);
    } else {
      //修改数据
      await this.spuRepository
        .createQueryBuilder()
        .update(SpuEntity)
        .set(spu)
        .where('id = :id', { id: spu.id })
        .execute();
      //删除该Spu的旧的Sku
      // await this.skuRepository
      //   .createQueryBuilder()
      //   .delete()
      //   .from(AddressEntity)
      //   .where('spuId = :spuId', { spuId: spu.id })
      //   .execute();
      await this.skuRepository.delete({ spuId: spu.id });
    }

    //   使用传入的sku
    const date = new Date();
    const category = await this.categoryRepository.findOneBy({
      id: spu.category3Id,
    });
    const brand = await this.brandRepository.findOneBy({ id: spu.brandId });

    const skuList = goods.skuList.map((sku) => {
      if (!sku.spec) {
        //防止空指针
        sku.spec = {};
      }

      let name = spu.name;
      // const specMap = JSON.parse(sku.spec);
      const specMap = sku.spec;

      for (const [key, value] of Object.entries(specMap)) {
        name += ' ' + value;
      }
      sku.name = name;
      sku.id = this.idWorker.nextId().toString();
      sku.spuId = spu.id;
      sku.createTime = date;
      sku.updateTime = date;
      sku.categoryId = spu.category3Id;
      sku.categoryName = category.name;
      sku.brandName = brand.name;
      return sku;
    });
    const data = this.skuRepository.insert(skuList);

    return new Result(data);
  }

  async findList(pageParma: any, conditions: SpuEntity) {
    const [data, total] = await findWithConditions(
      this.spuRepository,
      conditions,
      pageParma,
      'spu',
    );
    return new Result({ data, total });
  }

  async findById(id: string) {
    const data = await this.spuRepository.findOneBy({ id });
    return new Result(data);
  }

  async add(spu: SpuEntity) {
    const data = await this.spuRepository.insert(spu);
    return new Result(data);
  }

  async update(id: number, spu: SpuEntity) {
    const data = await this.spuRepository
      .createQueryBuilder()
      .update(SpuEntity)
      .set(spu)
      .where('id = :id', { id })
      .execute();
    return new Result(data);
  }

  async remove(id: number) {
    await this.spuRepository.delete(id);
    return new Result(null);
  }

  @Get()
  async findAll() {
    const data = await this.spuRepository.find();
    return new Result(data);
  }
}
