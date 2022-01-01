import { ApiProperty } from '@nestjs/swagger'

import { Expose, Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsString, IsUUID, Length } from 'class-validator'

import { CartState } from 'src/_common/types'

export class CartDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty({ enum: CartState })
  @IsEnum(CartState)
  state: CartState

  @ApiProperty()
  @IsUUID()
  customerId: string
}
export class ProductDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty()
  @IsString()
  @Length(3, 100)
  title: string

  @ApiProperty()
  @IsString()
  @Length(10, 800)
  description: string
}
export class GetCartItemDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @IsUUID()
  cartId: string

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

  @ApiProperty()
  @Expose()
  isDeleted: boolean

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty({ type: () => CartDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.cart
      ? {
          id: obj.cart.id,
          state: obj.cart.state,
          customerId: obj.cart.customerId,
        }
      : null,
  )
  cart: CartDto

  @ApiProperty({ type: () => CartDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.product
      ? {
          id: obj.product.id,
          title: obj.product.title,
          description: obj.product.description,
        }
      : null,
  )
  product: ProductDto
}
