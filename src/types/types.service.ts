import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindConditions, OrderByCondition, Repository } from 'typeorm'
import { isNotEmptyObject } from 'class-validator'

import { applyTypeOrmOperator } from 'src/_helpers/applyTypeOrmOperator'

import { ListType } from 'src/_common/types'

import { Type } from './entities/type.entity'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'
import { TypeQueryOptionsDto } from './dto/query-type.dto'
import { ListOptionsDto } from '../_common/list-options.dto'
import { PageResult } from 'src/_common/types'
import { Category } from 'src/categories/entities/category.entity'

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(Type) private typeRepo: Repository<Type>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async create(createTypeDto: CreateTypeDto) {
    const type = await this.typeRepo.create(createTypeDto)

    return this.typeRepo.save(type)
  }

  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.typeRepo.count()
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
    let where: FindConditions<Type>
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

    const types = await this.typeRepo.find({ where, order, skip, take })
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

    const totalItems = await this.typeRepo.count()
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

    const types = await this.typeRepo.find({ where, order, skip, take })
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
    return this.typeRepo.findOne({ where: { id, isDeleted: false } })
  }
  async update(id: string, updateTypeDto: UpdateTypeDto) {
    const existedType = await this.typeRepo.findOne(id)
    if (!existedType) throw new NotFoundException()
    let updatedType = this.typeRepo.merge(existedType, updateTypeDto)
    return this.typeRepo.save(updatedType)
  }

  async remove(id: string) {
    const existedType = await this.typeRepo.findOne(id)
    if (!existedType) throw new NotFoundException()
    return this.typeRepo.remove(existedType)
  }
  async softDelete(id: string) {
    const existedType = await this.typeRepo.findOne(id)
    if (!existedType) throw new NotFoundException()
    existedType.isDeleted = true
    return this.typeRepo.save(existedType)
  }
  async restore(id: string) {
    const existedType = await this.typeRepo.findOne(id)
    if (!existedType) throw new NotFoundException()
    existedType.isDeleted = false
    return this.typeRepo.save(existedType)
  }
}
