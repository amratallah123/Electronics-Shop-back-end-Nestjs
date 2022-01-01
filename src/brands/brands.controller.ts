import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpCode,
} from '@nestjs/common'

import { ApiTags } from '@nestjs/swagger'

import { BrandsService } from './brands.service'

import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'
import { BrandQueryOptionsDto } from './dto/query-brands.dto'
import { ListOptionsDto } from '../_common/list-options.dto'

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto)
  }

  @Get()
  list(@Query() listType: ListOptionsDto) {
    return this.brandsService.list(listType)
  }
  @HttpCode(200)
  @Post('query')
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: BrandQueryOptionsDto,
  ) {
    return this.brandsService.query(listType, options)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto)
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id)
  }
  @Delete('delete/:id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.softDelete(id)
  }
  @Patch('restore/:id')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.restore(id)
  }
}
