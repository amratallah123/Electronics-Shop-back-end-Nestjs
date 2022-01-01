import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('rates')
export class Rate extends EntityBase {
  @Column({ name: 'rate', type: 'smallint' })
  rate: number

  @Column({ name: 'customer_id', nullable: true })
  userId: string

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'customer_id' })
  customer: User

  @Column({ name: 'product_id', nullable: true })
  productId: string

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({ name: 'product_id' })
  product: Product
}
