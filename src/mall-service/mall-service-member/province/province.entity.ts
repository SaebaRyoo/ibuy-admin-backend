import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ibuy_provinces')
export class ProvinceEntity {
  @PrimaryColumn({ name: 'province_id' })
  provinceId: string;

  @Column({ name: 'province' })
  province: string;
}
