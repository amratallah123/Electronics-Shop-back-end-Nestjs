import { Entity, ManyToOne, Column, JoinColumn, OneToMany } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'
import { CartState } from 'src/_common/types'

import { User } from 'src/users/entities/user.entity'
import { CartItem } from 'src/carts/entities/cart-item.entity'
@Entity('carts')
export class Cart extends EntityBase {
  @Column({
    name: 'role',
    type: 'enum',
    enum: CartState,
    default: CartState.PENDING,
  })
  state: CartState

  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'customer_id', nullable: true })
  customerId: string

  @ManyToOne(() => User, (type) => type.carts)
  @JoinColumn({ name: 'customer_id' })
  customer: User

  @OneToMany(() => CartItem, (cartItems) => cartItems.cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  cartItems: CartItem[]
}
