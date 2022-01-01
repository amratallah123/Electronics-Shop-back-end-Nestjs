import { IsNumber, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCartItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string

  @ApiProperty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNumber()
  sellPrice: number

  @ApiProperty()
  @IsNumber()
  totalPrice: number
}
