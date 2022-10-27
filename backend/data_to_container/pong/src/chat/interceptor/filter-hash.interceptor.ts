import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Room } from 'src/bdd';
import { DeepPartial } from 'typeorm';

@Injectable()
export class FilterHashInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<DeepPartial<Room>> {
    return next.handle().pipe(
      map((obj) =>
        obj instanceof Room
          ? {
              name: obj.name,
              owner: obj.owner,
              isProtected: obj.isProtected,
              type: obj.type,
              members: obj.members,
            }
          : obj,
      ),
    );
  }
}
