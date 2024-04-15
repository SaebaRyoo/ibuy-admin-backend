import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoleEntity } from './users-role.entity';
import { UsersRoleService } from './users-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRoleEntity])],
  providers: [UsersRoleService],
  exports: [UsersRoleService],
})
export class UsersRoleModule {}
