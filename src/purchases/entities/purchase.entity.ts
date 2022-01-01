import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'
import { User } from 'src/users/entities/user.entity'
import { PurchaseItem } from './purchase-item.entity'

@Entity('purchases')
export class Purchase extends EntityBase {
  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date

  @Column({ name: 'total_price', type: 'decimal', default: 0.0 })
  totalPrice: number

  @Column({ name: 'employee_id', nullable: true })
  employeeId: string

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: 'employee_id' })
  employee: User

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  items: PurchaseItem[]
}
