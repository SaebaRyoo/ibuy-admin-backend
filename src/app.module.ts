import { Module } from '@nestjs/common';
import { AuthModule } from './api/admin/auth/auth.module';
import { UsersModule } from './api/admin/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './api/admin/role/role.module';
import { UsersRoleModule } from './api/admin/users-role/users-role.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { PermissionGuard } from './common/guards/permission.guard';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    RoleModule,
    UsersRoleModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true, // You will not need to import ConfigModule in other modules once it's been loaded in the root module
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          // With that option specified, every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.
          autoLoadEntities: true,
          // entities: [Users],
          synchronize: true,
        };
      },
    }),
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'log/combined.log',
          level: 'error',
        }),
        // other transports...
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
