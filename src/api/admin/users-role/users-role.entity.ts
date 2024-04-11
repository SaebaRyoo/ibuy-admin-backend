import { Entity, PrimaryColumn } from 'typeorm';

@Entity('ibuy_admin_role')
export class UsersRoleEntity {
  @PrimaryColumn()
  admin_id: number;

  @PrimaryColumn()
  role_id: number;
}
