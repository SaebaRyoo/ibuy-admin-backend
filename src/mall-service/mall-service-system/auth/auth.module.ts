import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SysUserModule } from '../users/sys-user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN'),
    },
  }),
});
@Module({
  imports: [SysUserModule, jwtModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [jwtModule],
})
export class AuthModule {}
