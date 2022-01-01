import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'src/products/entities/product.entity'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class WishListsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(auth: User, productId: string): Promise<void> {
    let product = await this.productRepository.findOneOrFail(productId)
    if (product) {
      let user = await this.usersRepository.findOne(auth.id, {
        relations: ['wishList'],
      })
      user.wishList.push(product)
      user.save()
    }
  }

  async findWishList(auth: User): Promise<Product[]> {
    let user = await this.usersRepository.findOne(auth.id, {
      relations: ['wishList'],
    })
    return user.wishList
  }

  async remove(id: string, auth: User): Promise<void> {
    let user = await this.usersRepository.findOne(auth.id, {
      relations: ['wishList'],
    })
    user.wishList = user.wishList.filter((product) => {
      return product.id !== id
    })
    await user.save()
  }
}
