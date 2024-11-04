import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PageParam {
  pageSize: number;
  current: number;
}

/**
 * 构建查询条件
 * @param repository
 * @param conditions
 * @param pageParam
 * @param alias
 */
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
  const propExist = filterValidPropertyNames(repository, conditionKeys); //判断是否为当前实体中的内容

  // 遍历条件对象的 key-value，根据条件动态添加查询条件
  propExist.forEach((key) => {
    const value = conditions[key];
    const snakeKey = camelToSnake(key);

    // 过滤掉空值
    if (value !== undefined && value !== null) {
      // 模糊匹配
      qb.andWhere(`${snakeKey} LIKE :value`, { value: `%${value}%` });
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

/**
 * 过滤出合法的属性名
 * @param repository
 * @param propertyNames
 */
function filterValidPropertyNames<TEntity>(
  repository: Repository<TEntity>,
  propertyNames: string[],
): string[] {
  const metadata = repository.manager.connection.getMetadata(repository.target);

  // 获取实体中所有的属性名
  const entityPropertyNames = metadata.columns.map(
    (column) => column.propertyName,
  );

  // 过滤出在实体中存在的属性名
  return propertyNames.filter((propertyName) =>
    entityPropertyNames.includes(propertyName),
  );
}
