import {
  Controller,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { PurchasesService } from './purchases.service'

import { CurrentUser } from 'src/auth/helpers/current-user.decorator'
import { Serialize } from 'src/_common/serialize.interceptor'
import { ParseUUIDsPipe } from 'src/_common/parse-uuids.pipe'

import { User } from 'src/users/entities/user.entity'
import { ListOptionsDto } from 'src/_common/list-options.dto'

import { GetPurchaseDto } from './dtos/get-purchase.dto'
import { CreatePurchaseItemDto, CreatePurchaseWithItemsDto } from './dtos/create-purchase.dto'
import { UpdatePurchaseDto } from './dtos/update-purchase.dto'

import { GetPurchaseItemDto } from './dtos/get-purchase-item.dto'
import { GetPurchaseWithItemsDto } from './dtos/get-purchase-with-items.dto'
import { UpdatePurchaseItemDto } from './dtos/update-purchase-item.dto'

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('list')
  @Serialize(GetPurchaseDto)
  list(@Query() listType: ListOptionsDto) {
    return this.purchasesService.list(listType)
  }

  @Get('ids/:ids')
  @Serialize(GetPurchaseDto)
  findByIds(@Param('ids', ParseUUIDsPipe) ids: string[]) {
    return this.purchasesService.findByIds(ids, ['employee'])
  }

  @Get(':id')
  @Serialize(GetPurchaseDto)
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.findPurchaseById(id, ['employee'])
  }

  @Get('item/:id')
  @Serialize(GetPurchaseItemDto)
  findItemById(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.findItemById(id, ['purchase', 'product'])
  }

  @Get(':id/items')
  @Serialize(GetPurchaseItemDto)
  findItemsByPurchaseId(@Param('id', ParseUUIDPipe) purchaseId: string) {
    return this.purchasesService.findItemsByPurchaseId(purchaseId, ['product'])
  }

  @Post()
  @Serialize(GetPurchaseWithItemsDto)
  createPurchaseWithItems(
    @CurrentUser() employee: User,
    @Body() data: CreatePurchaseWithItemsDto,
  ) {
    return this.purchasesService.createPurchaseWithItems(employee, data)
  }

  @Post(':id')
  @Serialize(GetPurchaseItemDto)
  createPurchaseItem(
    @Param('id', ParseUUIDPipe) purchaseId: string,
    @Body() data: CreatePurchaseItemDto,
  ) {
    return this.purchasesService.createPurchaseItem(purchaseId, data)
  }

  @Patch(':id')
  @Serialize(GetPurchaseDto)
  updatePurchase(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() employee: User,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchasesService.updatePurchase(id, employee, updatePurchaseDto)
  }

  @Patch('item/:id')
  @Serialize(GetPurchaseItemDto)
  updatePurchaseItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() attrs: UpdatePurchaseItemDto,
  ) {
    return this.purchasesService.updatePurchaseItem(id, attrs)
  }

  @Delete('remove/:id')
  @Serialize(GetPurchaseDto)
  removePurchase(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.removePurchase(id)
  }

  @Delete('remove/item/:id')
  @Serialize(GetPurchaseItemDto)
  removePurchaseItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.removePurchaseItem(id)
  }

  @Delete('delete/:id')
  @Serialize(GetPurchaseDto)
  deletePurchase(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.deletePurchase(id)
  }

  @Delete('delete/item/:id')
  @Serialize(GetPurchaseItemDto)
  deletePurchaseItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.deletePurchaseItem(id)
  }

  @Patch('restore/:id')
  @Serialize(GetPurchaseDto)
  restorePurchase(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.restorePurchase(id)
  }

  @Patch('restore/item/:id')
  @Serialize(GetPurchaseItemDto)
  restorePurchaseItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.restorePurchaseItem(id)
  }
}
