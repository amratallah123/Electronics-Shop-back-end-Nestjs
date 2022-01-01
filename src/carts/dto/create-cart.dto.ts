import { IsEnum, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CartState } from 'src/_common/types'
export class CreateCartDto {
  @ApiProperty({ enum: CartState })
  @IsEnum(CartState)
  state: CartState

  @ApiProperty()
  @IsUUID()
  customerId: string
}
