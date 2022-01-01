import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsDateString, IsInt, IsOptional, IsUUID, Min } from 'class-validator'

export class CreatePurchaseDto {
  @ApiProperty()
  @IsDateString()
  purchaseDate: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPrice?: number
}

export class CreatePurchaseItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsInt()
  @Min(1)
  unitPrice: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPrice?: number
}

export class CreatePurchaseWithItemsDto {
  @ApiProperty({ type: () => CreatePurchaseDto })
  purchase: CreatePurchaseDto

  @ApiProperty({ type: () => [CreatePurchaseItemDto] })
  items: CreatePurchaseItemDto[]
}
