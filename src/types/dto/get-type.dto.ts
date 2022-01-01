import { ApiProperty } from '@nestjs/swagger'

import { Expose, Transform } from 'class-transformer'

export class CategoryDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string
}

export class GetProductDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string
  @ApiProperty({ type: () => CategoryDto })
  @Expose()
  @Transform(({ obj }) => ({ id: obj.category.id, name: obj.category.name }))
  category: CategoryDto
}
