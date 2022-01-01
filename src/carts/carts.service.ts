import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { FindConditions, In, OrderByCondition, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmptyObject } from 'class-validator'

import { applyTypeOrmOperator } from 'src/_helpers/applyTypeOrmOperator'

import { Cart } from './entities/cart.entity'
import { User } from 'src/users/entities/user.entity'
import { CartItem } from 'src/carts/entities/cart-item.entity'
import { CartState, ListType, PageResult } from 'src/_common/types'

import { ListOptionsDto } from 'src/_common/list-options.dto'
import { TypeQueryOptionsDto } from 'src/types/dto/query-type.dto'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartStateDto } from './dto/update-cart-state.dto'
import { Product } from 'src/products/entities/product.entity'

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async create(customerId: string, createCartItemDto: CreateCartItemDto) {
    let cart: Cart
    let cartItem: CartItem

    cart = await this.cartRepo.findOne({
      where: {
        customerId,
        state: CartState.PENDING,
      },
      relations: ['cartItems'],
    })
    if (!cart) {
      cart = this.cartRepo.create({
        customerId: customerId,
        state: CartState.PENDING,
      })
      cart = await this.cartRepo.save(cart)
    }

    cartItem = this.cartItemRepo.create({
      ...createCartItemDto,
      cartId: cart.id,
      totalPrice: cartItem.quantity * cartItem.sellPrice,
    })
    cartItem = await this.cartItemRepo.save(cartItem)

    cart.totalPrice += cartItem.totalPrice
    cart = await this.cartRepo.save(cart)

    cart.cartItems.push(cartItem)
    return cart
  }

  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.cartRepo.count()
    const isPage = Boolean(pageNumber && pageSize)
    const totalPages = Math.ceil(totalItems / pageSize)

    let skip = 0,
      take = totalItems
    if (isPage) {
      if (pageNumber > totalPages) {
        throw new BadRequestException(
          'page not found [greater than total pages]',
        )
      }
      skip = (pageNumber - 1) * pageSize
      take = pageSize
    }
    const order: OrderByCondition = { createdAt: 'ASC' }
    let where: FindConditions<Cart>
    switch (type) {
      case ListType.ANY:
        where = {}
        break
      case ListType.EXISTED:
        where = { isDeleted: false }
        break
      case ListType.DELETED:
        where = { isDeleted: true }
        break
      default:
        where = { isDeleted: false }
        break
    }

    const types = await this.cartRepo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: types,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return types
  }

  async query(
    { type, pageNumber, pageSize }: ListOptionsDto,
    {
      where = {} as any,
      order = { createdAt: 'ASC' },
      relations,
    }: TypeQueryOptionsDto,
  ) {
    if (isNotEmptyObject(where)) {
      where = Object.entries(where).reduce((acc, [key, value]) => {
        acc[key] = value.includes('(') ? applyTypeOrmOperator(value) : value
        return acc
      }, {} as any)
    }
    console.log('🚀: Service -> query -> where', where)

    const totalItems = await this.cartRepo.count()
    const isPage = Boolean(pageNumber && pageSize)
    const totalPages = Math.ceil(totalItems / pageSize)
    let skip = 0,
      take = totalItems
    if (isPage) {
      if (pageNumber > totalPages) {
        throw new BadRequestException(
          'page not found [greater than total pages]',
        )
      }
      skip = (pageNumber - 1) * pageSize
      take = pageSize
    }

    switch (type) {
      case ListType.ANY:
        where = where
        break
      case ListType.EXISTED:
        where.isDeleted = false
        break
      case ListType.DELETED:
        where.isDeleted = true
        break
      default:
        where.isDeleted = false
        break
    }

    console.log('🚀: Service -> query -> where', where)

    const types = await this.cartRepo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: types,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return types
  }

  findOne(id: string) {
    return this.cartRepo.findOne({
      where: { id, isDeleted: false },
      relations: ['cartItems'],
    })
  }

  async adminUpdate(id: string, updateCartStateDto: UpdateCartStateDto) {
    const existedCart = await this.cartRepo.findOne(id)
    if (!existedCart) throw new NotFoundException()
    let updatedCart = this.cartRepo.merge(existedCart, {
      state: updateCartStateDto.state,
    })
    return this.cartRepo.save(updatedCart)
  }

  async incrementSales(cartItems: CartItem[]) {
    let productIds = cartItems.map((item) => item.productId)
    let products = await this.productRepo.find({ where: In(productIds) })

    products.forEach((product) => {
      let cartItem = cartItems.find((item) => item.productId === product.id)
      if (cartItem) {
        product.totalSalesQuantity += cartItem.quantity
        product.totalInStock -= cartItem.quantity
        product.totalSalesPrice += cartItem.totalPrice
        product.profit += cartItem.totalPrice
      }
    })
    this.productRepo.save(products)
  }

  async decrementSales(cartItems: CartItem[]) {
    let productIds = cartItems.map((item) => item.productId)
    let products = await this.productRepo.find({ where: In(productIds) })

    products.forEach((product) => {
      let cartItem = cartItems.find((item) => item.productId === product.id)
      if (cartItem) {
        product.totalSalesQuantity -= cartItem.quantity
        product.totalInStock += cartItem.quantity
        product.totalSalesPrice -= cartItem.totalPrice
        product.profit -= cartItem.totalPrice
      }
    })
    this.productRepo.save(products)
  }

  async remove(cartId: string) {
    const cart = await this.cartRepo.findOne(cartId, {
      relations: ['cartItems'],
    })
    if (!cart) throw new NotFoundException()

    await this.decrementSales(cart.cartItems)
    return this.cartRepo.remove(cart)
  }

  async submitCart(cartId: string) {
    let cart = await this.cartRepo.findOne(cartId, {
      relations: ['cartItems'],
    })
    if (!cart) throw new NotFoundException()

    cart.state = CartState.SUBMITTED
    let updatedCart = {
      ...cart,
      cartItems: null,
    }
    await this.cartRepo.save(updatedCart)

    await this.incrementSales(cart.cartItems)
    return cart
  }

  async cancelCart(cartId: string) {
    let cart = await this.cartRepo.findOne(cartId, {
      relations: ['cartItems'],
    })
    if (!cart) throw new NotFoundException()

    cart.state = CartState.PENDING
    let updatedCart = {
      ...cart,
      cartItems: null,
    }
    await this.cartRepo.save(updatedCart)

    await this.decrementSales(cart.cartItems)
    return cart
  }

  async updateQuantity(cartItemId: string, quantity: number) {
    let cartItem = await this.cartItemRepo.findOne(cartItemId)
    if (!cartItem) throw new NotFoundException('cart item not found')

    if (cartItem.quantity !== quantity) {
      const diffQuantity = quantity - cartItem.quantity
      const diffTotalPrice = quantity * cartItem.sellPrice - cartItem.totalPrice

      cartItem.quantity = quantity
      cartItem.totalPrice = cartItem.sellPrice * quantity
      cartItem = await this.cartItemRepo.save(cartItem)

      const cart = await this.cartRepo.findOne(cartItem.cartId)
      if (cart.state == CartState.SUBMITTED) {
        let product = await this.productRepo.findOne(cartItem.productId)
        product.totalSalesQuantity += diffQuantity
        product.totalInStock += diffQuantity
        product.totalSalesPrice += diffTotalPrice
        product.profit += diffTotalPrice
        await this.productRepo.save(product)
      }
    }
    return cartItem
  }
}
