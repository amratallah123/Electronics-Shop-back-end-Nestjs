import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, In, OrderByCondition, Repository } from 'typeorm'

import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'
import { Purchase } from './entities/purchase.entity'
import { PurchaseItem } from './entities/purchase-item.entity'

import { ListType, PageResult } from 'src/_common/types'
import { ListOptionsDto } from 'src/_common/list-options.dto'

import {
  CreatePurchaseItemDto,
  CreatePurchaseWithItemsDto,
} from './dtos/create-purchase.dto'
import { UpdatePurchaseDto } from './dtos/update-purchase.dto'
import { UpdatePurchaseItemDto } from './dtos/update-purchase-item.dto'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepo: Repository<PurchaseItem>,
  ) {}

  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.purchaseRepo.count()
    const totalPages = Math.ceil(totalItems / pageSize)
    const isPage = Boolean(pageNumber && pageSize)

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
    let where: FindConditions<Purchase>
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

    const purchases = await this.purchaseRepo.find({
      where,
      order,
      skip,
      take,
      relations: ['employee'],
    })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: purchases,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return purchases
  }

  async findByIds(ids: string[], relations: string[] = []) {
    let purchases = await this.purchaseRepo.findByIds(ids, { relations })
    if (!purchases.length) throw new NotFoundException()
    return purchases
  }

  async findPurchaseById(id: string, relations: string[] = []) {
    let existedPurchase = await this.purchaseRepo.findOne(id, { relations })
    if (!existedPurchase) throw new NotFoundException()
    return existedPurchase
  }

  async findItemById(id: string, relations: string[] = []) {
    let existedPurchaseItem = await this.purchaseItemRepo.findOne(id, {
      relations,
    })
    if (!existedPurchaseItem) throw new NotFoundException()
    return existedPurchaseItem
  }

  async findItemsByPurchaseId(purchaseId: string, relations: string[] = []) {
    let existedPurchaseItems = await this.purchaseItemRepo.find({
      where: { purchaseId },
      relations,
    })
    if (!existedPurchaseItems.length) throw new NotFoundException()
    return existedPurchaseItems
  }

  async createPurchaseWithItems(
    employee: User,
    { purchase, items }: CreatePurchaseWithItemsDto,
  ) {
    // calc each item totalPrice if not provided
    if (items.some((item) => !item.totalPrice)) {
      items = items.map((item) => ({
        ...item,
        totalPrice: item.unitPrice * item.quantity,
      }))
    }

    // calc purchase totalPrice and create the entity
    let newPurchase: Purchase
    if (!purchase.totalPrice) {
      newPurchase = this.purchaseRepo.create({
        ...purchase,
        employeeId: employee.id,
        totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
      })
    } else {
      newPurchase = this.purchaseRepo.create({
        ...purchase,
        employeeId: employee.id,
      })
    }
    // save purchase
    newPurchase = await this.purchaseRepo.save(newPurchase)

    // assign to each item the generated purchaseId and create the entities
    let newItems = items.map((item) =>
      this.purchaseItemRepo.create({
        ...item,
        purchaseId: newPurchase.id,
      }),
    )
    // bulk insert purchase items
    newItems = await this.purchaseItemRepo.save(newItems)

    // update computed fields in each product in purchaseItems
    let productIds = newItems.map((item) => item.productId)
    let products = await this.productRepo.find({ where: In(productIds) })

    products.forEach((product) => {
      let purchaseItem = newItems.find((item) => item.productId === product.id)
      if(purchaseItem) {
        product.totalPurchasesQuantity += purchaseItem.quantity
        product.totalInStock += purchaseItem.quantity
        product.totalPurchasesPrice += purchaseItem.totalPrice
        product.profit -= purchaseItem.totalPrice
      }
    })
    this.productRepo.save(products)

    // assign newItems to items in newPurchase and return it
    newPurchase.employee = employee
    newPurchase.items = newItems
    return newPurchase
  }

  async createPurchaseItem(purchaseId: string, item: CreatePurchaseItemDto) {
    // get the purchase
    let purchase = await this.findPurchaseById(purchaseId)

    // calc item totalPrice if not provided
    if (!item.totalPrice) {
      item.totalPrice = item.unitPrice * item.quantity
    }

    // create and save purchaseItem
    let newItem = this.purchaseItemRepo.create({
      ...item,
      purchaseId,
    })
    newItem = await this.purchaseItemRepo.save(newItem)

    // update totalPrice in purchase and save it
    purchase.totalPrice += newItem.totalPrice
    purchase = await this.purchaseRepo.save(purchase)

    // update computed fields in product
    let product = await this.productRepo.findOne(newItem.productId)

    product.totalPurchasesQuantity += newItem.quantity
    product.totalInStock += newItem.quantity
    product.totalPurchasesPrice += newItem.totalPrice
    product.profit -= newItem.totalPrice

    product = await this.productRepo.save(product)

    // return the new created purchaseItem
    return newItem
  }

  async updatePurchase(id: string, employee: User, attrs: UpdatePurchaseDto) {
    let existedPurchase = await this.findPurchaseById(id)
    let updatedPurchase = this.purchaseRepo.merge(existedPurchase, {
      ...attrs,
      employeeId: employee.id,
    })
    updatedPurchase.employee = employee
    return this.purchaseRepo.save(updatedPurchase)
  }

  async updatePurchaseItem(id: string, attrs: UpdatePurchaseItemDto) {
    // get the old purchaseItem
    const existedItem = await this.findItemById(id)
    // merge it with new values and save it
    let updatedItem = this.purchaseItemRepo.merge(existedItem, attrs)
    updatedItem = await this.purchaseItemRepo.save(updatedItem)

    // calc the diff values between old and new
    const diffQuantity = attrs.quantity - existedItem.quantity
    const diffTotalPrice = attrs.totalPrice - existedItem.totalPrice
    // update computed fields in product
    if(diffQuantity !== 0 || diffTotalPrice !== 0) {
      let product = await this.productRepo.findOne(existedItem.productId)
      if(product) {
        product.totalPurchasesQuantity += diffQuantity
        product.totalInStock += diffQuantity
        product.totalPurchasesPrice += diffTotalPrice
        product.profit -= diffTotalPrice

        product = await this.productRepo.save(product)
      }
    }

    // return the updatedItem
    return updatedItem
  }

  async removePurchase(id: string) {
    // find existedPurchase with items
    const existedPurchase = await this.findPurchaseById(id, ['items'])

    // remove existedPurchase with its items
    let removedPurchase = await this.purchaseRepo.remove(existedPurchase)

    // update computed fields in each product in purchaseItems
    const productIds = existedPurchase.items.map((item) => item.productId)
    let products = await this.productRepo.find({ where: In(productIds) })

    products.forEach((product) => {
      let purchaseItem = existedPurchase.items.find((item) => item.productId === product.id)
      if(purchaseItem) {
        product.totalPurchasesQuantity -= purchaseItem.quantity
        product.totalInStock -= purchaseItem.quantity
        product.totalPurchasesPrice -= purchaseItem.totalPrice
        product.profit += purchaseItem.totalPrice
      }
    })
    this.productRepo.save(products)

    // return the removedPurchase
    return removedPurchase
  }

  async removePurchaseItem(id: string) {
    // get purchaseItem and remove it form db
    const existedItem = await this.findItemById(id)
    let removedItem = await this.purchaseItemRepo.remove(existedItem)

    // update computed fields in product
    let product = await this.productRepo.findOne(existedItem.productId)

    product.totalPurchasesQuantity -= existedItem.quantity
    product.totalInStock -= existedItem.quantity
    product.totalPurchasesPrice -= existedItem.totalPrice
    product.profit += existedItem.totalPrice

    product = await this.productRepo.save(product)

    // return the removed purchaseItem
    return removedItem
  }

  async deletePurchase(id: string) {
    let existedPurchase = await this.findPurchaseById(id, ['items'])
    existedPurchase.isDeleted = true
    existedPurchase.items.forEach((item) => {
      item.isDeleted = true
    })
    return this.purchaseItemRepo.save(existedPurchase)
  }

  async restorePurchase(id: string) {
    let existedPurchase = await this.findPurchaseById(id, ['items'])
    existedPurchase.isDeleted = false
    existedPurchase.items.forEach((item) => {
      item.isDeleted = false
    })
    return this.purchaseItemRepo.save(existedPurchase)
  }

  async deletePurchaseItem(id: string) {
    let existedItem = await this.findItemById(id)
    existedItem.isDeleted = true
    return this.purchaseItemRepo.save(existedItem)
  }

  async restorePurchaseItem(id: string) {
    let existedItem = await this.findItemById(id)
    existedItem.isDeleted = false
    return this.purchaseItemRepo.save(existedItem)
  }
}
