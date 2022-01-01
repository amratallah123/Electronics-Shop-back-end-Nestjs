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

import { CategoriesService } from './categories.service'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryQueryOptionsDto } from './dto/query-category.dto'
import { ListOptionsDto } from '../_common/list-options.dto'
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Get()
  list(@Query() listType: ListOptionsDto) {
    return this.categoriesService.list(listType)
  }
  @HttpCode(200)
  @Post('query')
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: CategoryQueryOptionsDto,
  ) {
    return this.categoriesService.query(listType, options)
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto)
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id)
  }
  @Delete('delete/:id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.softDelete(id)
  }
  @Patch('restore/:id')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.restore(id)
  }
}
