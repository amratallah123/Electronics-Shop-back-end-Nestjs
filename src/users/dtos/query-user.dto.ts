import { ApiProperty } from '@nestjs/swagger'

import { Gender, UserRole } from '../../_common/types'

class UserWhereConditions {
  @ApiProperty({ type: String, nullable: true })
  firstName?: string

  @ApiProperty({ type: String, nullable: true })
  lastName?: string

  @ApiProperty({ type: String, nullable: true })
  email?: string

  @ApiProperty({ type: String, nullable: true })
  birthDate?: string

  @ApiProperty({ enum: Gender, nullable: true })
  gender?: Gender

  @ApiProperty({ type: String, nullable: true })
  address?: string

  @ApiProperty({ type: String, nullable: true })
  mobile?: string

  @ApiProperty({ enum: UserRole, nullable: true })
  role?: UserRole

  @ApiProperty({ type: Boolean, nullable: true })
  isDeleted?: boolean
}

class UserOrderByOptions {
  @ApiProperty({ type: String, nullable: true })
  id?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  firstName?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  lastName?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  email?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  birthDate?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  gender?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  address?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  mobile?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  role?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  createdAt?: 'ASC' | 'DESC' | 1 | -1

  @ApiProperty({ type: String, nullable: true })
  updatedAt?: 'ASC' | 'DESC' | 1 | -1
}

export class UserQueryOptionsDto {
  @ApiProperty({ type: () => UserWhereConditions, nullable: true })
  where?: UserWhereConditions

  @ApiProperty({ type: () => UserOrderByOptions, nullable: true })
  order?: UserOrderByOptions

  @ApiProperty({ type: [String], nullable: true })
  relations?: string[]
}
