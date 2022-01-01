import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common'
import { CartsService } from './carts.service'

import { UpdateCartDto } from './dto/update-cart.dto'
import { CreateCartDto } from './dto/create-cart.dto'
import { ApiTags } from '@nestjs/swagger'
import { ListOptionsDto } from 'src/_common/list-options.dto'
import { TypeQueryOptionsDto } from 'src/types/dto/query-type.dto'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { UpdateCartStateDto } from './dto/update-cart-state.dto'
@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Authorize()
  @Post('create')
  async create(
    @CurrentUser() user: User,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return await this.cartsService.create(user.id, createCartItemDto)
  }

  @Get('list')
  list(@Query() listType: ListOptionsDto) {
    return this.cartsService.list(listType)
  }

  @HttpCode(200)
  @Post('query')
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: TypeQueryOptionsDto,
  ) {
    return this.cartsService.query(listType, options)
  }

  @Get('getOne/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartsService.findOne(id)
  }

  @Authorize('admin', 'editor')
  @Patch('update/:id')
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCartState: UpdateCartStateDto,
  ) {
    return this.cartsService.adminUpdate(id, updateCartState)
  }

  @Authorize('customer')
  @Delete('remove/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cartsService.remove(id)
  }

  @Authorize('customer')
  @Patch('submit-cart')
  submitCart(@Param('id', ParseUUIDPipe) CartId: string) {
    return this.cartsService.submitCart(CartId)
  }

  @Authorize('customer')
  @Patch('cancel-cart')
  cancelCart(@Param('id', ParseUUIDPipe) CartId: string) {
    return this.cartsService.cancelCart(CartId)
  }

  @Authorize('customer')
  @Patch('update-quantity/:id')
  updateQuantity(
    @Param('id', ParseUUIDPipe) cartItemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartsService.updateQuantity(cartItemId, quantity)
  }

}
