import { Module } from '@nestjs/common';
import { WishListsService } from './wish-lists.service';
import { WishListsController } from './wish-lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User , Product])],
  controllers: [WishListsController],
  providers: [WishListsService]
})
export class WishListsModule {}
