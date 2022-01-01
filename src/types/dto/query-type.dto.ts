import { ApiProperty } from '@nestjs/swagger'

class TypeWhereConditions {
  @ApiProperty({ type: String, nullable: true })
  name?: string
  @ApiProperty({ type: Boolean, nullable: true })
  isDeleted?: boolean
}

class TypeOrderByOptions {
  @ApiProperty({ type: String, nullable: true })
  id?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  name?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  createdAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  updatedAt?: 'ASC' | 'DESC' | 1 | -1
}

export class TypeQueryOptionsDto {
  @ApiProperty({ type: () => TypeWhereConditions, nullable: true })
  where?: TypeWhereConditions

  @ApiProperty({ type: () => TypeOrderByOptions, nullable: true })
  order?: TypeOrderByOptions

  @ApiProperty({ type: [String], nullable: true })
  relations?: string[]
}
