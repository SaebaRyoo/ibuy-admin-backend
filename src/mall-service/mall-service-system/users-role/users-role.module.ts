import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRoleEntity } from './users-role.entity';
import { UsersRoleService } from './users-role.service';
import { UsersRoleController } from './users-role.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsersRoleEntity])],
  providers: [UsersRoleService],
  controllers: [UsersRoleController],
  exports: [UsersRoleService],
})
export class UsersRoleModule {}
