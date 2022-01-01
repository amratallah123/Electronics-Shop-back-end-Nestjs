import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class ProductDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  title: string

  @ApiProperty()
  @Expose()
  description: string
}

export class PurchaseDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  purchaseDate: Date

  @ApiProperty()
  @Expose()
  totalPrice: number
}

export class GetPurchaseItemDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  quantity: number

  @ApiProperty()
  @Expose()
  unitPrice: number

  @ApiProperty()
  @Expose()
  totalPrice: number

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date

  @ApiProperty()
  @Expose()
  isDeleted: boolean

  @ApiProperty({ type: () => ProductDto })
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

  @ApiProperty({ type: () => PurchaseDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.purchase
      ? {
          id: obj.purchase.id,
          date: obj.purchase.purchaseDate,
          totalPrice: obj.purchase.totalPrice,
        }
      : null,
  )
  purchase: PurchaseDto
}
