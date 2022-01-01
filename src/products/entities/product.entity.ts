import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'

import { User } from 'src/users/entities/user.entity'
import { Category } from 'src/categories/entities/category.entity'
import { Type } from 'src/types/entities/type.entity'
import { Brand } from 'src/brands/entities/brand.entity'
import { PurchaseItem } from 'src/purchases/entities/purchase-item.entity'
import { CartItem } from 'src/carts/entities/cart-item.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rate } from 'src/rates/entities/rate.entity'

@Entity('products')
export class Product extends EntityBase {
  @Column({ name: 'title', type: 'varchar', length: 100 })
  title: string

  @Column({ name: 'description', type: 'varchar', length: 800 })
  description: string

  @Column({ name: 'photos', type: 'varchar', length: 2000, nullable: true })
  photos?: string

  @Column({ name: 'category_id', nullable: true })
  categoryId: string

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @Column({ name: 'type_id', nullable: true })
  typeId: string

  @ManyToOne(() => Type, (type) => type.products)
  @JoinColumn({ name: 'type_id' })
  type: Type

  @Column({ name: 'brand_id', nullable: true })
  brandId: string

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand

  @Column({ name: 'total_purchases_price', type: 'decimal', default: 0.0 })
  totalPurchasesPrice: number

  @Column({ name: 'total_sales_price', type: 'decimal', default: 0.0 })
  totalSalesPrice: number

  @Column({ name: 'total_purchase', type: 'decimal', default: 0.0 })
  profit: number

  @Column({ name: 'total_purchases_quantity', type: 'int', default: 0 })
  totalPurchasesQuantity: number

  @Column({ name: 'total_sales_quantity', type: 'int', default: 0 })
  totalSalesQuantity: number

  @Column({ name: 'total_in_stock', type: 'int', default: 0 })
  totalInStock: number

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.product, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  purchasesItems: PurchaseItem[]

  @OneToMany(() => CartItem, (cartItems) => cartItems.cart, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  cartItems: CartItem[]

  @OneToMany(() => Comment, (comment) => comment.product, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  comments: Comment[]

  @OneToMany(() => Rate, (rate) => rate.product, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  rates: Rate[]

  @ManyToMany(() => User)
  wishingList: User[]
}
