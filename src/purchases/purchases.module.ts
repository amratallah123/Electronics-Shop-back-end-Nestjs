import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PurchasesController } from './purchases.controller'
import { PurchasesService } from './purchases.service'

import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from './entities/purchase-item.entity'
import { Product } from 'src/products/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseItem, Product])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
