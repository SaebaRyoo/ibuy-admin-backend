import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../../common/guards/auth.guard';

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

// register the authentication guard as a global guard
const registerAuthGuardAsGlobalGuard = {
  provide: APP_GUARD,
  useClass: AuthGuard,
};

@Module({
  imports: [UsersModule, jwtModule],
  providers: [AuthService, registerAuthGuardAsGlobalGuard],
  controllers: [AuthController],
  exports: [jwtModule],
})
export class AuthModule {}
