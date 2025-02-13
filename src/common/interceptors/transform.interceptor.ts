import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

interface Response<T> {
  data: T;
}

/**
 * 统一响应体拦截器
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data: data?.data,
        code: data?.code,
        extra: {
          path: context.switchToHttp().getRequest().url,
        },
        message: data?.message,
        success: true,
      })),
    );
  }
}
