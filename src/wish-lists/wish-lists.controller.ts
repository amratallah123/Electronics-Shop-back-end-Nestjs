import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { WishListsService } from './wish-lists.service'

@Controller('wish')
export class WishListsController {
  constructor(private readonly wishListsService: WishListsService) { }

  @Authorize()
  @Post(':id')
  create(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) productId: string,
  ) {
    return this.wishListsService.create(user, productId)
  }

  @Authorize()
  @Get()
  findWishList(@CurrentUser() user: User) {
    return this.wishListsService.findWishList(user)
  }

  @Delete(':id')
  remove(@CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) productId: string,) {
    return this.wishListsService.remove(productId, user)
  }
}
