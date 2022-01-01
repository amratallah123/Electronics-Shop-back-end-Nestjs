import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { CartState } from 'src/_common/types'
export class UpdateCartStateDto {
  @ApiProperty({ enum: CartState })
  @IsEnum(CartState)
  state: CartState
}
