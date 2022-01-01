import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { ListType } from 'src/_common/types'

export class ListOptionsDto {
  @ApiPropertyOptional({ enum: ListType, nullable: true })
  @IsOptional()
  @IsEnum(ListType)
  type?: ListType

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number
}
