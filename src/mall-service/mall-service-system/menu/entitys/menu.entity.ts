import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('ibuy_menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;
}
