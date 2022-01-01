import { ApiProperty } from '@nestjs/swagger'

class BrandWhereConditions {
  @ApiProperty({ type: String, nullable: true })
  name?: string
  @ApiProperty({ type: Boolean, nullable: true })
  isDeleted?: boolean
}

class BrandOrderByOptions {
  @ApiProperty({ type: String, nullable: true })
  id?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  name?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  createdAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  updatedAt?: 'ASC' | 'DESC' | 1 | -1
}

export class BrandQueryOptionsDto {
  @ApiProperty({ type: () => BrandWhereConditions, nullable: true })
  where?: BrandWhereConditions

  @ApiProperty({ type: () => BrandOrderByOptions, nullable: true })
  order?: BrandOrderByOptions

  @ApiProperty({ type: [String], nullable: true })
  relations?: string[]
}
