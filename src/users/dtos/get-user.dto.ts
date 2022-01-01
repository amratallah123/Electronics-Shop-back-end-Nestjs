import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { Gender, UserRole } from '../../_common/types'

export class GetUserDto {
  @Expose()
  @ApiProperty()
  id: string

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  name: string

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty({ enum: Gender })
  gender: Gender

  @Expose()
  @ApiProperty()
  birthDate: Date

  @Expose()
  @ApiProperty()
  address: string

  @Expose()
  @ApiProperty()
  mobile: string

  @Expose()
  @ApiProperty({ enum: UserRole })
  role: UserRole

  @Expose()
  @ApiProperty()
  isDeleted: boolean

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiProperty()
  updatedAt: Date
}
