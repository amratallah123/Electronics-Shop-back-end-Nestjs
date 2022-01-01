import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'

import { Gender, UserRole, AccountStatus } from 'src/_common/types'

import { Product } from 'src/products/entities/product.entity'
import { Purchase } from 'src/purchases/entities/purchase.entity'
import { Cart } from 'src/carts/entities/cart.entity'
import { Comment } from 'src/comments/entities/comment.entity'
import { Rate } from 'src/rates/entities/rate.entity'

@Entity('users')
export class User extends EntityBase {
  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string

  @Column({ name: 'gender', type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date

  @Column({ name: 'address', type: 'varchar', length: 500 })
  address: string

  @Column({ name: 'mobile', type: 'varchar', length: 11 })
  mobile: string

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string

  @Column({ name: 'password', type: 'varchar', length: 60 })
  password: string

  @Column({ name: 'verification_code', type: 'varchar', length: 10, nullable: true })
  verificationCode?: string

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @Column({
    name: 'status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus

  @OneToMany(() => Purchase, (purchase) => purchase.employee, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  purchases: Purchase[]

  @OneToMany(() => Cart, (cart) => cart.customer, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  carts: Cart[]

  @OneToMany(() => Comment, (comment) => comment.customer, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  comments: Comment[]

  @OneToMany(() => Rate, (rate) => rate.customer, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  rates: Rate[]

  @ManyToMany(() => Product)
  @JoinTable({ name: 'customers_wish_lists' })
  wishList: Product[]
}
