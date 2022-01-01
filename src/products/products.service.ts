import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindConditions, In, OrderByCondition, Repository } from 'typeorm'
import { isNotEmptyObject } from 'class-validator'

import { applyTypeOrmOperator } from 'src/_helpers/applyTypeOrmOperator'

import { Product } from './entities/product.entity'

import { ListType, PageResult } from 'src/_common/types'
import { ListOptionsDto } from 'src/_common/list-options.dto'
import { ProductQueryOptionsDto } from './dtos/query-product.dto'
import { CreateProductDto } from './dtos/create-product.dto'
import { UpdateProductDto } from './dtos/update-product.dto'

const fs = require('fs')
@Injectable()
export class ProductsService {
  relations: string[]
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {
    this.relations = ['category', 'type', 'brand']
  }

  getPhotos(photos: Express.Multer.File[]) {
    return photos
      .map((photo) => {
        const [_, ...rest] = photo.path.split('\\')
        return rest.join('/')
      })
      .join(', ')
  }

  async list({ type, pageNumber, pageSize }: ListOptionsDto) {
    const totalItems = await this.repo.count()
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
    let where: FindConditions<Product>
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

    const products = await this.repo.find({
      where,
      order,
      skip,
      take,
      relations: this.relations,
    })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: products,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return products
  }

  async query(
    { type, pageNumber, pageSize }: ListOptionsDto,
    {
      where = {} as any,
      order = { createdAt: 'ASC' },
      relations = this.relations,
    }: ProductQueryOptionsDto,
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

    const totalItems = await this.repo.count({ where })
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

    const products = await this.repo.find({
      where,
      order,
      skip,
      take,
      relations,
    })
    if (isPage) {
      let pageResult: PageResult = {
        pageItems: products,
        totalItems,
        totalPages,
      }
      return pageResult
    }
    return products
  }

  async findIds(ids: string[]) {
    const products = await this.repo.find({
      where: { id: In(ids) },
      relations: [...this.relations, 'wishingList'],
    })
    if (!products.length) throw new NotFoundException()
    return products
  }

  async findId(id: string) {
    const existedProduct = await this.repo.findOne(id, {
      relations: [...this.relations, 'wishingList'],
    })
    if (!existedProduct) throw new NotFoundException()
    return existedProduct
  }

  async create(product: CreateProductDto) {
    let newProduct = this.repo.create(product)
    newProduct = await this.repo.save(newProduct)
    return this.findId(newProduct.id)
  }

  async createAndUploadPhotos(
    product: CreateProductDto,
    photos: Express.Multer.File[],
  ) {
    let newProduct = this.repo.create({
      ...product,
      photos: this.getPhotos(photos),
    })
    newProduct = await this.repo.save(newProduct)
    return this.findId(newProduct.id)
  }

  async update(id: string, attrs: UpdateProductDto) {
    let existedProduct = await this.findId(id)
    let productToUpdate = this.repo.merge(existedProduct, attrs)
    return this.repo.save(productToUpdate)
  }

  async updateAndUploadPhotos(
    id: string,
    attrs: UpdateProductDto,
    photos: Express.Multer.File[],
  ) {
    // find the existedProduct by id
    let existedProduct = await this.findId(id)
    // delete the old photos from HD if exists
    if(existedProduct.photos) {
      for (const dbPath of existedProduct.photos.split(', ')) {
        const serverPath = `./public/${dbPath}`
        fs.existsSync(serverPath) && fs.unlinkSync(serverPath)
      }
    }
    // update existedProduct photos to new photos paths
    existedProduct.photos = this.getPhotos(photos)
    // merge to update existedProduct with attrs
    let updatedProduct = this.repo.merge(existedProduct, attrs)
    // save the updatedProduct to db
    return this.repo.save(updatedProduct)
  }

  async delete(id: string) {
    let existedProduct = await this.findId(id)
    existedProduct.isDeleted = true
    return this.repo.save(existedProduct)
  }

  async restore(id: string) {
    let existedProduct = await this.findId(id)
    existedProduct.isDeleted = false
    return this.repo.save(existedProduct)
  }

  async remove(id: string) {
    let existedProduct = await this.repo.findOne(id)
    return this.repo.remove(existedProduct)
  }
}
