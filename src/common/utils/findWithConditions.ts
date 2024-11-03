import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PageParam {
  pageSize: number;
  current: number;
}

export default async function findWithConditions<T>(
  repository: Repository<T>,
  conditions: Partial<T>,
  pageParam: PageParam,
  alias?: string,
): Promise<[T[], number]> {
  // 校验分页参数
  const pageSize = pageParam.pageSize > 0 ? pageParam.pageSize : 10; // 默认每页 10 条
  const current = pageParam.current > 0 ? pageParam.current : 1; // 默认第一页

  // 创建查询构造器
  const qb: SelectQueryBuilder<T> = repository
    .createQueryBuilder(alias || 'entity')
    .skip(pageSize * (current - 1))
    .limit(pageSize);

  if (!conditions) {
    return qb.getManyAndCount();
  }
  // 如果条件对象为空，直接返回所有数据
  const conditionKeys = Object.keys(conditions);
  if (conditionKeys.length === 0) {
    return qb.getManyAndCount();
  }

  // 遍历条件对象的 key-value，根据条件动态添加查询条件
  conditionKeys.forEach((key) => {
    const value = conditions[key];
    if (value !== undefined && value !== null) {
      // 过滤掉空值
      qb.andWhere(`${camelToSnake(key)} = :value`, { value });
    }
  });

  const results = await qb.getManyAndCount();

  // 处理空结果
  if (results[0].length === 0) {
    console.warn('No results found for the given conditions');
  }

  return results;
}

/**
 * 驼峰转下划线：比如 trueOrFalse => true_or_false
 * @param camelCase
 */
function camelToSnake(camelCase: string): string {
  return camelCase.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
