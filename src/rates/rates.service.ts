import { Injectable } from '@nestjs/common'
import { RateDto } from './dto/rate.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'
import { Rate } from './entities/rate.entity'

@Injectable()
export class RatesService {
  constructor(
    @InjectRepository(Rate)
    private ratesRepository: Repository<Rate>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(productId: string, auth: User, rateDto: RateDto): Promise<void> {
    let rate = await this.ratesRepository.findOne({
      where: { userId: auth.id, productId: productId },
    })

    if (!rate) {
      let createRate = this.ratesRepository.create({
        userId: auth.id,
        productId,
        rate: rateDto.rate,
      })
      createRate.save()
    }
  }

  async update(productId: string, auth: User, rateDto: RateDto): Promise<void> {
    let rate = await this.ratesRepository.findOne({
      where: { userId: auth.id, productId: productId },
    })

    if (rate) {
      await this.ratesRepository.update(rate.id, {
        rate: rateDto.rate,
      })
    }
  }
}
