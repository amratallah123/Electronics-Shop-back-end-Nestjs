import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindConditions, OrderByCondition, Repository } from 'typeorm'
import { isNotEmptyObject } from 'class-validator'

import { applyTypeOrmOperator } from 'src/_helpers/applyTypeOrmOperator'

import { ListType, PageResult } from 'src/_common/types'
import { Category } from './entities/category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryQueryOptionsDto } from './dto/query-category.dto'
import { ListOptionsDto } from '../_common/list-options.dto'
@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.repo.create(createCategoryDto)
    return this.repo.save(category)
  }
  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.repo.count()
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
    let where: FindConditions<Category>
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

    const categories = await this.repo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: categories,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return categories
  }

  async query(
    { type, pageNumber, pageSize }: ListOptionsDto,
    {
      where = {} as any,
      order = { createdAt: 'ASC' },
      relations,
    }: CategoryQueryOptionsDto,
  ) {
    if (isNotEmptyObject(where)) {
      where = Object.entries(where).reduce((acc, [key, value]) => {
        acc[key] = value.includes('(') ? applyTypeOrmOperator(value) : value
        return acc
      }, {} as any)
    }
    console.log('🚀: Service -> query -> where', where)

    const totalItems = await this.repo.count()
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

    const categories = await this.repo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: categories,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return categories
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id, isDeleted: false } })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existedCategory = await this.repo.findOne(id)
    if (!existedCategory) throw new NotFoundException()
    let updatedCategory = this.repo.merge(existedCategory, updateCategoryDto)
    return this.repo.save(updatedCategory)
  }
  async remove(id: string) {
    const existedCategory = await this.repo.findOne(id)
    if (!existedCategory) throw new NotFoundException()
    return this.repo.remove(existedCategory)
  }
  async softDelete(id: string) {
    const existedCategory = await this.repo.findOne(id)
    if (!existedCategory) throw new NotFoundException()
    existedCategory.isDeleted = true
    return this.repo.save(existedCategory)
  }
  async restore(id: string) {
    const existedCategory = await this.repo.findOne(id)
    if (!existedCategory) throw new NotFoundException()
    existedCategory.isDeleted = false
    return this.repo.save(existedCategory)
  }
}
