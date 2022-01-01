import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'
import { Purchase } from './purchase.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('purchases_items')
export class PurchaseItem extends EntityBase {
  @Column({ name: 'quantity', type: 'int', default: 0 })
  quantity: number

  @Column({ name: 'unit_price', type: 'decimal', default: 0.0 })
  unitPrice: number

  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'product_id', nullable: true })
  productId: string

  @ManyToOne(() => Product, (product) => product.purchasesItems)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column({ name: 'purchase_id', nullable: true })
  purchaseId: string

  @ManyToOne(() => Purchase, (purchase) => purchase.items)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase
}
