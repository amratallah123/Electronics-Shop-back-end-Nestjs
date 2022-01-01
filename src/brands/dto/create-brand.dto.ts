import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  @Length(2, 50)
  name: string
}
