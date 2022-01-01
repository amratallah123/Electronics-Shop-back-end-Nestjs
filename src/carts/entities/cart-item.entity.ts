import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { EntityBase } from 'src/_common/EntityBase'
import { Cart } from 'src/carts/entities/cart.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('carts_items')
export class CartItem extends EntityBase {
  @Column({ name: 'cart_id', nullable: true })
  cartId: string

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart

  @Column({ name: 'product_id', nullable: true })
  productId: string

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column({ name: 'quantity', type: 'int', default: 0 })
  quantity: number

  @Column({ name: 'sell_price', type: 'decimal', default: 0.0 })
  sellPrice: number

  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number
}
