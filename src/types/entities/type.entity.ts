import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'

import { Category } from 'src/categories/entities/category.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('types')
export class Type extends EntityBase {
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string

  @ManyToOne(() => Category, (category) => category.types)
  @JoinColumn({ name: 'category_id' })
  category: Category
  @Column({ name: 'category_id', nullable: true })
  cartId: string

  @OneToMany(() => Product, (product) => product.type, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove']
  })
  products: Product[]
}
