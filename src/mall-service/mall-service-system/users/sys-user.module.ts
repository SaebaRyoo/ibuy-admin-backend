import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUsersEntity } from './entitys/sys-user.entity';
import { UsersService } from './sys-user.service';
import { SysUserController } from './sys-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SysUsersEntity])],
  providers: [UsersService],
  controllers: [SysUserController],
  exports: [UsersService],
})
export class SysUserModule {}
