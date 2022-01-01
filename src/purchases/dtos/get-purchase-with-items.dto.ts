import { ApiProperty } from '@nestjs/swagger'

import { Expose, Transform } from 'class-transformer'

import { EmployeeDto } from './get-purchase.dto'

export class ItemDto {
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
  productId: string
}

export class GetPurchaseWithItemsDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  purchaseDate: string

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

  @ApiProperty({ type: () => EmployeeDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.employee
      ? {
          id: obj.employee.id,
          name: `${obj.employee.firstName} ${obj.employee.lastName}`,
        }
      : null,
  )
  employee: EmployeeDto

  @ApiProperty({ type: () => ItemDto })
  @Expose()
  @Transform(({ obj }) =>
    obj.items
      ? obj.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          productId: item.productId
        }))
      : null,
  )
  items: ItemDto
}
