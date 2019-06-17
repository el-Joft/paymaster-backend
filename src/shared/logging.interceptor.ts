import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log('Before...');
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    if (req) {
      const method = req.method;
      // const url = req.url;

      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `After...${method} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    }

    return next.handle();

  }
}
