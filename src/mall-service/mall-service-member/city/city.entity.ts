import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ibuy_cities')
export class CityEntity {
  @PrimaryColumn({ name: 'city_id' })
  cityId: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'province_id' })
  provinceId: string;
}
