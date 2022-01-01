import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { UsersService } from './users.service'
import { Authorize } from 'src/auth/helpers/auth.guard'
import { Serialize } from 'src/_common/serialize.interceptor'
import { ParseUUIDsPipe } from 'src/_common/parse-uuids.pipe'
import { CurrentUser } from 'src/auth/helpers/current-user.decorator'

import { User } from './entities/user.entity'
import { ListOptionsDto } from '../_common/list-options.dto'
import { UserQueryOptionsDto } from './dtos/query-user.dto'
import { GetUserDto } from './dtos/get-user.dto'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { GetProductDto } from 'src/products/dtos/get-product.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorize('admin')
  @Get('list')
  @Serialize(GetUserDto)
  list(@Query() listType: ListOptionsDto) {
    return this.usersService.list(listType)
  }

  @Authorize('admin')
  @Post('query')
  @HttpCode(200)
  @Serialize(GetUserDto)
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: UserQueryOptionsDto,
  ) {
    return this.usersService.query(listType, options)
  }

  @Authorize('admin', 'editor')
  @Get('ids/:ids')
  @Serialize(GetUserDto)
  findIds(@Param('ids', ParseUUIDsPipe) ids: string[]) {
    return this.usersService.findIds(ids)
  }

  @Authorize('admin', 'editor', 'customer')
  @Get(':id')
  @Serialize(GetUserDto)
  findId(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findId(id)
  }

  @Authorize('admin')
  @Post()
  @Serialize(GetUserDto)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Authorize('admin', 'editor')
  @Patch(':id')
  @Serialize(GetUserDto)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto)
  }

  @Authorize('admin', 'editor', 'customer')
  @Delete('delete/:id')
  @Serialize(GetUserDto)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id)
  }

  @Authorize('admin', 'editor')
  @Patch('restore/:id')
  @Serialize(GetUserDto)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.restore(id)
  }

  @Authorize('admin')
  @Delete('remove/:id')
  @Serialize(GetUserDto)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id)
  }

  @Authorize('admin', 'editor', 'customer')
  @Get('wish-list')
  @Serialize(GetProductDto)
  wishList(@CurrentUser() user: User) {
    return this.usersService.getWishList(user.id)
  }

  @Authorize('admin', 'editor', 'customer')
  @Put('wish-list/:productId')
  @Serialize(GetProductDto)
  addToWishList(
    @CurrentUser() user: User,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.usersService.addToWishList(user.id, productId)
  }

  @Authorize('admin', 'editor', 'customer')
  @Delete('wish-list/:productId')
  @Serialize(GetProductDto)
  removeFromWishList(
    @CurrentUser() user: User,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.usersService.removeFromWishList(user.id, productId)
  }
}
