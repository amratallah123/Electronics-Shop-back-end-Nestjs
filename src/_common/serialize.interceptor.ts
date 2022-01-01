import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common'

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { plainToClass } from 'class-transformer'
import { anyClass } from './types'

export function Serialize(dto: anyClass) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: anyClass) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) =>
        data && data.pageItems
          ? {
              ...data,
              pageItems: plainToClass(this.dto, data.pageItems, {
                excludeExtraneousValues: true,
              }),
            }
          : plainToClass(this.dto, data, { excludeExtraneousValues: true }),
      ),
    )
  }
}
