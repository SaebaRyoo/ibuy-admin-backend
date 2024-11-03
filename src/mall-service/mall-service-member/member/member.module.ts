import { Global, Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './member.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
