import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

import { isUUID } from 'class-validator'

@Injectable()
export class ParseUUIDsPipe implements PipeTransform<string, string[]> {
  transform(value: string, _: ArgumentMetadata): string[] {
    const ids = value
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    for (const id of ids) {
      if (!isUUID(id)) {
        throw new BadRequestException('one of the given uuids is not valid')
      }
    }

    return ids
  }
}
