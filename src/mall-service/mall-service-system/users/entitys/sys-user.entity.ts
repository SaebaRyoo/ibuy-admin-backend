import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ibuy_admin')
export class SysUsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'login_name', unique: true, nullable: true })
  loginName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  status: string;
}
