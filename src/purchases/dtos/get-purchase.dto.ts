import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class EmployeeDto {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string
}

export class GetPurchaseDto {
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
}
