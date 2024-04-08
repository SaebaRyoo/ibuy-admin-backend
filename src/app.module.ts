import { Module } from '@nestjs/common';
import { AuthModule } from './api/admin/auth/auth.module';
import { UsersModule } from './api/admin/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './api/admin/users/users.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, // You will not need to import ConfigModule in other modules once it's been loaded in the root module
    }),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       dialect: 'postgres',
    //       host: configService.get('POSTGRES_PORT'),
    //       port: configService.get('POSTGRES_HOST'),
    //       username: configService.get('POSTGRES_USER'),
    //       password: configService.get('POSTGRES_PASSWORD'),
    //       database: configService.get('POSTGRES_DATABASE') as string,
    //       synchronize: true,
    //     };
    //   },
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'zqy19970114',
      database: 'mall',
      entities: [Users],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
