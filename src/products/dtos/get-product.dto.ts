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

export class TypeDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string
}

export class BrandDto {
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
  title: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty({ type: [String], nullable: true })
  @Expose()
  @Transform(({ obj }) => (obj.photos ? obj.photos.split(', ') : null))
  photos: string[] | null

  @ApiProperty()
  @Expose()
  isDeleted: boolean

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty({ type: () => CategoryDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.category ? { id: obj.category.id, name: obj.category.name } : null,
  )
  category: CategoryDto

  @ApiProperty({ type: () => CategoryDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.type ? { id: obj.type.id, name: obj.type.name } : null,
  )
  type: TypeDto

  @ApiProperty({ type: () => CategoryDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.brand ? { id: obj.brand.id, name: obj.brand.name } : null,
  )
  brand: BrandDto

  @ApiProperty({ type: () => CategoryDto })
  @Expose()
  @Transform(({ obj }) => obj.wishingList?.Length ?? 0)
  wishingCount: number
}
