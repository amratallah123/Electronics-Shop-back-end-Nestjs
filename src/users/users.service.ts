import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import * as bcrypt from 'bcrypt'
import { isNotEmptyObject } from 'class-validator'
import { FindConditions, In, OrderByCondition, Repository } from 'typeorm'

import { ListType, PageResult } from 'src/_common/types'
import { applyTypeOrmOperator } from 'src/_helpers/applyTypeOrmOperator'

import { User } from './entities/user.entity'
import { Product } from 'src/products/entities/product.entity'

import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UserQueryOptionsDto } from './dtos/query-user.dto'
import { ListOptionsDto } from '../_common/list-options.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.userRepo.count()
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
    let where: FindConditions<User>
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

    const users = await this.userRepo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: users,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return users
  }

  async query(
    { type, pageNumber, pageSize }: ListOptionsDto,
    {
      where = {} as any,
      order = { createdAt: 'ASC' },
      relations,
    }: UserQueryOptionsDto,
  ) {
    if (isNotEmptyObject(where)) {
      where = Object.entries(where).reduce((acc, [key, value]) => {
        acc[key] = value.includes('(') ? applyTypeOrmOperator(value) : value
        return acc
      }, {} as any)
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

    const totalItems = await this.userRepo.count({ where })
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

    const users = await this.userRepo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: users,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return users
  }

  async findIds(ids: string[]) {
    const users = await this.userRepo.find({ where: { id: In(ids) } })
    if (!users.length) throw new NotFoundException()
    return users
  }

  async findId(id: string) {
    const existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException()

    return existedUser
  }

  findEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ email })
  }

  async create(user: CreateUserDto) {
    const existedUser = await this.userRepo.findOne({ email: user.email })
    if (existedUser) throw new BadRequestException('email already exists')

    const hashedPassword = await bcrypt.hash(user.password, 12)
    let newUser = this.userRepo.create({
      ...user,
      password: hashedPassword,
    })
    return this.userRepo.save(newUser)
  }

  async update(id: string, attrs: UpdateUserDto) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException()

    let userToUpdate = this.userRepo.merge(existedUser, attrs)
    return this.userRepo.save(userToUpdate)
  }

  async delete(id: string) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException()

    existedUser.isDeleted = true
    return this.userRepo.save(existedUser)
  }

  async restore(id: string) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException()

    existedUser.isDeleted = false
    return this.userRepo.save(existedUser)
  }

  async remove(id: string) {
    let existedUser = await this.userRepo.findOne(id)
    if (!existedUser) throw new NotFoundException()

    return this.userRepo.remove(existedUser)
  }

  async getWishList(userId: string) {
    let user = await this.userRepo.findOne(userId, { relations: ['wishList'] })
    if (!user) throw new NotFoundException('user not found')

    return user.wishList
  }

  async addToWishList(userId: string, productId: string) {
    let user = await this.userRepo.findOne(userId, { relations: ['wishList'] })
    if (!user) throw new NotFoundException('user not found')

    let product = await this.productRepo.findOne(productId)
    if (!product) throw new NotFoundException('product not found')

    user.wishList.push(product)
    await this.userRepo.save(user)

    return user.wishList
  }

  async removeFromWishList(userId: string, productId: string) {
    let user = await this.userRepo.findOne(userId, { relations: ['wishList'] })
    if (!user) throw new NotFoundException('user not found')

    user.wishList = user.wishList.filter((product) => product.id !== productId)
    await this.userRepo.save(user)

    return user.wishList
  }
}
