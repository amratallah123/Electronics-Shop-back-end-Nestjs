import { IsString, IsUUID, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateTypeDto {
  @ApiProperty()
  @IsString()
  @Length(2, 50)
  name: string
  @ApiProperty()
  @IsUUID()
  categoryId: string
}
