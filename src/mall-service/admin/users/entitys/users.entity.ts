import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('ibuy_admin')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  login_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  status: string;
}
