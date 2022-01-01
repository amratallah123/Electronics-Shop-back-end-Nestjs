import { Entity, Column, OneToMany } from 'typeorm'

import { EntityBase } from 'src/_common/EntityBase'

import { Product } from 'src/products/entities/product.entity'

@Entity('brands')
export class Brand extends EntityBase {
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string

  @OneToMany(() => Product, (product) => product.brand, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove']
  })
  products: Product[]
}
