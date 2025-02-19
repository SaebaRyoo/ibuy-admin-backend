// src/mall-service/mall-service-goods/brand/dto/create-brand.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  // 假设品牌有名称字段，这里做非空验证
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  letter: string;
}
