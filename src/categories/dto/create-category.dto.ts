import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(2, 50)
  name: string
}
