import { ApiProperty } from '@nestjs/swagger'

import { IsString, IsUUID, Length } from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  title: string

  @ApiProperty()
  @IsString()
  @Length(10, 800)
  description: string

  @ApiProperty()
  @IsUUID()
  categoryId: string

  @ApiProperty()
  @IsUUID()
  typeId: string

  @ApiProperty()
  @IsUUID()
  brandId: string
}
