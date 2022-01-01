import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ProductsService } from './products.service'

import { Authorize } from 'src/auth/helpers/auth.guard'
import { Serialize } from 'src/_common/serialize.interceptor'
import { UploadImages } from 'src/_common/file-upload.decorator'
import { ParseFile } from 'src/_common/parse-file.pipe'
import { ParseUUIDsPipe } from 'src/_common/parse-uuids.pipe'

import { GetProductDto } from './dtos/get-product.dto'
import { ListOptionsDto } from 'src/_common/list-options.dto'
import { ProductQueryOptionsDto } from './dtos/query-product.dto'
import { CreateProductDto } from './dtos/create-product.dto'
import { UpdateProductDto } from './dtos/update-product.dto'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Authorize('admin')
  @Get('list')
  @Serialize(GetProductDto)
  list(@Query() listType: ListOptionsDto) {
    return this.productsService.list(listType)
  }

  @Authorize('admin')
  @Post('query')
  @HttpCode(200)
  @Serialize(GetProductDto)
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: ProductQueryOptionsDto,
  ) {
    return this.productsService.query(listType, options)
  }

  @Authorize('admin', 'editor')
  @Get(':id')
  @Serialize(GetProductDto)
  findId(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findId(id)
  }

  @Authorize('admin', 'editor')
  @Get('ids/:ids')
  @Serialize(GetProductDto)
  findIds(@Param('ids', ParseUUIDsPipe) ids: string[]) {
    return this.productsService.findIds(ids)
  }

  @Authorize('admin')
  @Post()
  @Serialize(GetProductDto)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }

  @Authorize('admin')
  @Post('create-and-upload-photos')
  @UploadImages('photos', true)
  @Serialize(GetProductDto)
  createAndUploadPhotos(
    @UploadedFiles(ParseFile) photos: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.createAndUploadPhotos(createProductDto, photos)
  }

  @Authorize('admin', 'editor')
  @Patch(':id')
  @Serialize(GetProductDto)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateUserDto)
  }

  @Authorize('admin', 'editor')
  @Patch('update-and-upload-photos/:id')
  @UploadImages('photos', true)
  @Serialize(GetProductDto)
  updateAndUploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(ParseFile) photos: Express.Multer.File[],
    @Body() updateUserDto: UpdateProductDto,
  ) {
    return this.productsService.updateAndUploadPhotos(id, updateUserDto, photos)
  }

  @Authorize('admin', 'editor')
  @Delete('delete/:id')
  @Serialize(GetProductDto)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id)
  }

  @Authorize('admin', 'editor')
  @Patch('restore/:id')
  @Serialize(GetProductDto)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.restore(id)
  }

  @Authorize('admin')
  @Delete('remove/:id')
  @Serialize(GetProductDto)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
