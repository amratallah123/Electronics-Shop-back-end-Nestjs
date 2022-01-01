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
import { Brand } from './entities/brand.entity'
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { BrandQueryOptionsDto } from './dto/query-brands.dto'
import { ListOptionsDto } from '../_common/list-options.dto'

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private repo: Repository<Brand>) {}
  create(createBrandDto: CreateBrandDto) {
    const brand = this.repo.create(createBrandDto)
    return this.repo.save(brand)
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
    let where: FindConditions<Brand>
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

    const brands = await this.repo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: brands,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return brands
  }

  async query(
    { type, pageNumber, pageSize }: ListOptionsDto,
    {
      where = {} as any,
      order = { createdAt: 'ASC' },
      relations,
    }: BrandQueryOptionsDto,
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

    const brands = await this.repo.find({ where, order, skip, take })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: brands,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return brands
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id, isDeleted: false } })
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const existedBrand = await this.repo.findOne(id)
    if (!existedBrand) throw new NotFoundException()
    let updatedBrand = this.repo.merge(existedBrand, updateBrandDto)
    return this.repo.save(updatedBrand)
  }

  async remove(id: string) {
    const existedBrand = await this.repo.findOne(id)
    if (!existedBrand) throw new NotFoundException()
    return this.repo.remove(existedBrand)
  }
  async softDelete(id: string) {
    const existedBrand = await this.repo.findOne(id)
    if (!existedBrand) throw new NotFoundException()
    existedBrand.isDeleted = true
    return this.repo.save(existedBrand)
  }
  async restore(id: string) {
    const existedBrand = await this.repo.findOne(id)
    if (!existedBrand) throw new NotFoundException()
    existedBrand.isDeleted = false
    return this.repo.save(existedBrand)
  }
}
