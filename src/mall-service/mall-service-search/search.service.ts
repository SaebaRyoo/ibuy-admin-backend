import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SkuService } from '../mall-service-goods/sku/sku.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly skuService: SkuService, // 注入 SkuService
  ) {}

  async importSku(): Promise<void> {
    // 从 Feign 服务获取 SKU 列表
    const [skuInfos, total] = await this.skuService.findList({
      current: 1,
      pageSize: 99999,
    });

    // 构建 Bulk 请求  将每个 SKU 信息的索引操作和文档内容展平为一个单一的数组
    const body = skuInfos.flatMap((skuInfo) => {
      // 解析 spec 字符串为对象
      // console.log(skuInfo.spec);
      // skuInfo.spec = JSON.parse(skuInfo.spec); // 将 specMap 设置到 skuInfo 中

      return [
        { index: { _index: 'skuinfo', _id: skuInfo.id } }, // 创建索引操作
        skuInfo, // 文档内容
      ];
    });

    // 执行 Bulk 导入
    if (body.length) {
      await this.elasticsearchService.bulk({
        operations: body,
      });
    }
  }
}
