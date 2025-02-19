import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/base.exception.filter';
import { HttpExceptionFilter } from './common/filters/http.excepition.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // 使用 cookie-parser 中间件

  await app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 设置统一响应体格式的拦截器
  app.useGlobalInterceptors(
    new TransformInterceptor(app.get(WINSTON_MODULE_PROVIDER)),
  );
  // 异常过滤器
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(WINSTON_MODULE_PROVIDER)),
    new HttpExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)),
  );

  // 全局pipe
  app.useGlobalPipes(new ValidationPipe());

  // 接口版本化处理
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // 配置swagger
  // const config = new DocumentBuilder()
  //   .setTitle('ibuy-admin后端接口服务')
  //   .setDescription('管理端接口')
  //   .setVersion('1.0')
  //   .addBearerAuth() // 让ui界面支持填写token
  //   .setVersion('v1')
  //   .addServer('/v1') // 添加一个url prefix
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('doc', app, document);

  await app.listen(8001, '0.0.0.0');
}
bootstrap();
