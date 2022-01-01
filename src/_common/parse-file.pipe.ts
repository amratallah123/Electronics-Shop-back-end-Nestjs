import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    _: ArgumentMetadata,
    ): Express.Multer.File | Express.Multer.File[] {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new BadRequestException('file(s) expected')
    }
    return files
  }
}
