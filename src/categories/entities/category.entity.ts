import { Entity, Column, OneToMany } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'

import { Type } from 'src/types/entities/type.entity'
import { Product } from 'src/products/entities/product.entity'

@Entity('categories')
export class Category extends EntityBase {
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string

  @OneToMany(() => Type, (type) => type.category)
  types: Type[]

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  products: Product[]
}
