import { ApiProperty } from '@nestjs/swagger'

import {
  IsEnum,
  IsEmail,
  IsString,
  Length,
  IsDateString,
  IsNumberString,
} from 'class-validator'

import { Gender, UserRole } from '../../_common/types'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2, 20)
  firstName: string

  @ApiProperty()
  @IsString()
  @Length(5, 50)
  lastName: string

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty()
  @IsDateString()
  birthDate: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @Length(6, 60)
  password: string

  @ApiProperty()
  @IsString()
  @Length(10, 500)
  address: string

  @ApiProperty()
  @IsNumberString()
  @Length(11, 11)
  mobile: string

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole
}
