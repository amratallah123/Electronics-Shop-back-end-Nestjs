import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'

class ProductWhereConditions {
  @ApiProperty({ type: String, nullable: true })
  title?: string

  @ApiProperty({ type: String, nullable: true })
  description?: string

  @ApiProperty({ enum: String, nullable: true })
  @IsUUID()
  categoryId?: string

  @ApiProperty({ type: String, nullable: true })
  @IsUUID()
  typeId?: string

  @ApiProperty({ type: String, nullable: true })
  @IsUUID()
  brandId?: string

  @ApiProperty({ type: String, nullable: true })
  createdAt?: string

  @ApiProperty({ type: Boolean, nullable: true })
  isDeleted?: boolean
}

class ProductOrderByOptions {
  @ApiProperty({ type: String, nullable: true })
  id?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  title?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  description?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  categoryId?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  typeId?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  brandId?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  createdAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  updatedAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  isDeleted?: 'ASC' | 'DESC' | 1 | -1
}

export class ProductQueryOptionsDto {
  @ApiProperty({ type: () => ProductWhereConditions, nullable: true })
  where?: ProductWhereConditions

  @ApiProperty({ type: () => ProductOrderByOptions, nullable: true })
  order?: ProductOrderByOptions

  @ApiProperty({ type: [String], nullable: true })
  relations?: string[]
}
