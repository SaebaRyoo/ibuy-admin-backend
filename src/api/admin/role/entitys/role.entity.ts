import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ibuy_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  name: string;
}
