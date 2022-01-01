import { ApiProperty } from '@nestjs/swagger'

class CategoryWhereConditions {
  @ApiProperty({ type: String, nullable: true })
  name?: string
  @ApiProperty({ type: Boolean, nullable: true })
  isDeleted?: boolean
}

class CategoryOrderByOptions {
  @ApiProperty({ type: String, nullable: true })
  id?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  name?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  createdAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  updatedAt?: 'ASC' | 'DESC' | 1 | -1
}

export class CategoryQueryOptionsDto {
  @ApiProperty({ type: () => CategoryWhereConditions, nullable: true })
  where?: CategoryWhereConditions

  @ApiProperty({ type: () => CategoryOrderByOptions, nullable: true })
  order?: CategoryOrderByOptions

  @ApiProperty({ type: [String], nullable: true })
  relations?: string[]
}
