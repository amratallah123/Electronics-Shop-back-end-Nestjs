import { PartialType } from '@nestjs/swagger'
import { CreatePurchaseItemDto } from './create-purchase.dto'

export class UpdatePurchaseItemDto extends PartialType(CreatePurchaseItemDto) {}
