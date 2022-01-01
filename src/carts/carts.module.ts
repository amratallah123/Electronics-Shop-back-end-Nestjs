import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CartsController } from './carts.controller'
import { CartsService } from './carts.service'

import { User } from 'src/users/entities/user.entity'
import { Cart } from './entities/cart.entity'
import { CartItem } from 'src/carts/entities/cart-item.entity'
import { Product } from 'src/products/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Product])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
