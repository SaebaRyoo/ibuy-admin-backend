import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SkuService } from '../mall-service-goods/sku/sku.service';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { SkuEntity } from '../mall-service-goods/sku/sku.entity';
import Result from '../../common/utils/Result';
import { Cron } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SearchService {
  private readonly ES_INDEX = 'skuinfo';
  private readonly SEARCH_PRICE = 'price';
  private readonly SEARCH_CATEGORY = 'categoryName';
  private readonly ES_CATEGORY_AGR = 'categoryNameAgr';
  private readonly SEARCH_BRAND = 'brandName';
  private readonly ES_BRAND_AGR = 'brandNameAgr';
  private readonly ES_SPEC_MAP_AGR = 'specMapAgr';
  private readonly PAGE_SIZE = 30;
  private readonly BATCH_SIZE = 1000; // 批量处理的大小
  private readonly MAX_RETRIES = 3; // 最大重试次数

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly skuService: SkuService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  // 每天凌晨2点执行数据同步
  @Cron('0 0 2 * * *')
  async syncSkuData() {
    this.logger.log('info', '开始同步SKU数据到Elasticsearch...');
    try {
      await this.importSku();
      this.logger.log('info', 'SKU数据同步完成');
    } catch (error) {
      this.logger.error('SKU数据同步失败:', error);
    }
  }

  /**
   * 全量导入(优化前)
   */
  // async importSku(): Promise<void> {
  //   // 从 sku 服务获取 SKU 列表
  //   const result = await this.skuService.findAll();
  //   const skuInfos = result.data;
  //   // 构建 Bulk 请求  将每个 SKU 信息的索引操作和文档内容展平为一个单一的数组
  //   const body = skuInfos.flatMap((skuInfo) => {
  //     return [
  //       { index: { _index: 'skuinfo', _id: skuInfo.id } }, // 创建索引操作
  //       skuInfo, // 文档内容
  //     ];
  //   });

  //   // 执行 Bulk 导入
  //   if (body.length) {
  //     await this.elasticsearchService.bulk({
  //       operations: body,
  //     });
  //   }
  // }

  /**
   * 分批导入SKU数据到Elasticsearch
   */
  async importSku(): Promise<void> {
    try {
      // 1. 检查索引是否存在，不存在则创建
      const indexExists = await this.elasticsearchService.indices.exists({
        index: this.ES_INDEX,
      });

      if (!indexExists) {
        await this.createSkuIndex();
      }

      // 2. 获取所有SKU数据
      const result = await this.skuService.findAll();
      const skuInfos = result.data;

      if (!skuInfos || skuInfos.length === 0) {
        this.logger.log('info', '没有SKU数据需要同步');
        return;
      }

      // 3. 分批处理数据
      for (let i = 0; i < skuInfos.length; i += this.BATCH_SIZE) {
        const batch = skuInfos.slice(i, i + this.BATCH_SIZE);
        await this.processBatch(batch, 0);
        this.logger.log(
          'info',
          `已处理 ${i + batch.length}/${skuInfos.length} 条数据`,
        );
      }
    } catch (error) {
      this.logger.error('导入SKU数据失败:', error);
      throw error;
    }
  }

  /**
   * 处理单个批次的数据，包含重试机制
   */
  private async processBatch(
    batch: SkuEntity[],
    retryCount: number,
  ): Promise<void> {
    try {
      const operations = batch.flatMap((skuInfo) => [
        { index: { _index: this.ES_INDEX, _id: skuInfo.id } },
        skuInfo,
      ]);

      const { errors, items } = await this.elasticsearchService.bulk({
        operations,
        refresh: true,
      });

      if (errors) {
        // 收集失败的项
        const failedItems = items
          .filter((item) => item.index?.error)
          .map((item) => ({
            id: item.index?._id,
            error: item.index?.error,
          }));

        if (failedItems.length > 0) {
          this.logger.error('部分数据导入失败:', failedItems);

          // 如果还可以重试，则重试失败的项
          if (retryCount < this.MAX_RETRIES) {
            const failedSkus = batch.filter((sku) =>
              failedItems.some((item) => item.id === sku.id.toString()),
            );
            await this.processBatch(failedSkus, retryCount + 1);
          } else {
            this.logger.error(
              `达到最大重试次数(${this.MAX_RETRIES})，放弃重试`,
            );
          }
        }
      }
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(`批处理失败，进行第${retryCount + 1}次重试`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1)),
        ); // 指数退避
        await this.processBatch(batch, retryCount + 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * 创建SKU索引及其映射
   */
  private async createSkuIndex(): Promise<void> {
    try {
      await this.elasticsearchService.indices.create({
        index: this.ES_INDEX,
        body: {
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'ik_max_word' },
              price: { type: 'double' },
              categoryName: { type: 'keyword' },
              brandName: { type: 'keyword' },
              spec: { type: 'keyword' },
              // 可以根据需要添加更多字段映射
            },
          },
        },
      });
      this.logger.log('info', `创建索引 ${this.ES_INDEX} 成功`);
    } catch (error) {
      this.logger.error('创建索引失败:', error);
      throw error;
    }
  }

  // 关键词搜索
  async search(searchMap: Record<string, string>) {
    let keywords = searchMap['keywords'];
    if (!keywords) {
      keywords = ''; // 默认搜索关键字
      // keywords = '华为'; // 默认搜索关键字
    }

    //一.构建过滤语句
    const boolQuery = {
      bool: {
        must: [],
        filter: [],
      },
    };

    // 1.1 关键字查询
    if (keywords) {
      boolQuery.bool.must.push({
        match: {
          name: keywords,
        },
      });
    }

    // 1.2 分类过滤
    if (searchMap[this.SEARCH_CATEGORY]) {
      boolQuery.bool.filter.push({
        term: {
          [`${this.SEARCH_CATEGORY}.keyword`]: searchMap[this.SEARCH_CATEGORY],
        },
      });
    }

    // 1.3. 品牌过滤
    if (searchMap[this.SEARCH_BRAND]) {
      boolQuery.bool.filter.push({
        term: {
          [`${this.SEARCH_BRAND}.keyword`]: searchMap[this.SEARCH_BRAND],
        },
      });
    }

    // 1.4. 规格过滤
    Object.keys(searchMap).forEach((key) => {
      if (key.startsWith('spec_')) {
        if (typeof searchMap[key] === 'string') {
          boolQuery.bool.filter.push({
            term: {
              [`spec.${key.substring(5)}.keyword`]: searchMap[key],
            },
          });
        } else if (Array.isArray(searchMap[key])) {
          boolQuery.bool.filter.push({
            terms: {
              [`spec.${key.substring(5)}.keyword`]: searchMap[key],
            },
          });
        }
      }
    });

    // 1.5. 价格过滤
    const price = searchMap[this.SEARCH_PRICE];
    if (price) {
      const [minPrice, maxPrice] = price.split('-');
      if (maxPrice !== '*') {
        boolQuery.bool.filter.push({
          range: {
            price: { gte: minPrice, lte: maxPrice },
          },
        });
      } else {
        boolQuery.bool.filter.push({
          range: {
            price: { gte: minPrice },
          },
        });
      }
    }

    // 构建搜索请求
    const searchRequest = {
      index: this.ES_INDEX,
      from: (this.pageConvert(searchMap) - 1) * this.PAGE_SIZE,
      size: this.PAGE_SIZE,
      query: boolQuery,
      sort: [],
      aggregations: {},
    };

    // 二. 排序
    const sortField = searchMap['sortField'];
    const sortRule = searchMap['sortRule'];
    if (sortField && sortRule) {
      searchRequest.sort.push({
        [sortField]: {
          order: sortRule.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      });
    }

    // 三、聚合数据
    searchRequest.aggregations = {
      // 分类聚合
      [this.ES_CATEGORY_AGR]: {
        terms: { field: `${this.SEARCH_CATEGORY}.keyword`, size: 50 },
      },
      // 品牌聚合
      [this.ES_BRAND_AGR]: {
        terms: { field: `${this.SEARCH_BRAND}.keyword`, size: 50 },
      },
      // 商品规格聚合
      [this.ES_SPEC_MAP_AGR]: {
        terms: { field: 'spec.keyword', size: 10000 },
      },
    };

    const response =
      await this.elasticsearchService.search<SkuEntity>(searchRequest);

    // 解析结果
    const resultMap = new Map();

    // 判断是否需要回显数据
    // 如果没有传分类名，就回显聚合的分类数据
    if (!searchMap[this.SEARCH_CATEGORY]) {
      const categoryList = this.getAggregationData(
        response,
        this.ES_CATEGORY_AGR,
      );
      resultMap.set('categoryList', categoryList);
    }
    // 如果没有传品牌名，就回显聚合的品牌数据
    if (!searchMap[this.SEARCH_BRAND]) {
      const brandList = this.getAggregationData(response, this.ES_BRAND_AGR);
      resultMap.set('brandList', brandList);
    }
    const specMap = this.getStringSetMap(
      response,
      this.ES_SPEC_MAP_AGR,
      searchMap,
    );
    resultMap.set('specMap', specMap);

    const skuInfos = response.hits.hits.map((hit) => hit._source);
    resultMap.set('rows', skuInfos);
    resultMap.set('pageSize', this.PAGE_SIZE);
    resultMap.set('pageNumber', this.pageConvert(searchMap));
    if (
      typeof response.hits.total === 'object' &&
      'value' in response.hits.total
    ) {
      resultMap.set('total', response.hits.total.value);
      resultMap.set(
        'totalPages',
        Math.ceil(response.hits.total.value / this.PAGE_SIZE),
      );
    } else {
      // 如果是 long 类型，直接将其当作 number 使用
      resultMap.set('total', response.hits.total);
      resultMap.set(
        'totalPages',
        Math.ceil(response.hits.total / this.PAGE_SIZE),
      );
    }

    // return resultMap;
    return new Result({ data: Object.fromEntries(resultMap) });
  }

  private pageConvert(searchMap: Record<string, string>): number {
    let pageNum = 1;
    if (searchMap['pageNum']) {
      try {
        pageNum = parseInt(searchMap['pageNum'], 10);
        if (pageNum < 1) pageNum = 1;
      } catch {
        pageNum = 1;
      }
    }
    return pageNum;
  }

  /**
   * 获取分类、品牌数据
   *
   * @param response
   * @param agrName
   * @return
   */
  private getAggregationData(
    response: SearchResponse<SkuEntity>,
    agrName: string,
  ): string[] {
    const data = [];
    const buckets = (response.aggregations[agrName] as any).buckets;
    buckets.forEach((bucket) => data.push(bucket.key));
    return data;
  }

  /**
   * 获取规格列表数据
   *
   * @param response  elasticsearch返回的数据
   * @param agrName   聚合数据时起的别名
   * @param searchMap 客户端传入的数据
   * @return
   */
  private getStringSetMap(
    response: SearchResponse<SkuEntity>,
    agrName: string,
    searchMap: Record<string, string>,
  ): Record<string, Set<string>> {
    const specMap = {};
    const buckets = (response.aggregations[agrName] as any).buckets;
    buckets.forEach((bucket) => {
      const specJson = bucket.key;
      const spec = JSON.parse(specJson);
      Object.keys(spec).forEach((key) => {
        if (!searchMap[`spec_${key}`]) {
          if (!specMap[key]) {
            specMap[key] = new Set();
          }
          specMap[key].add(spec[key]);
        }
      });
    });
    return specMap;
  }
}
