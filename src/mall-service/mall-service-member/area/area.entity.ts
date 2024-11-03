import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ibuy_areas')
export class AreaEntity {
  @PrimaryColumn({ name: 'area_id' })
  areaId: string;

  @Column({ name: 'area' })
  area: string;

  @Column({ name: 'city_id' })
  cityId: string;
}
