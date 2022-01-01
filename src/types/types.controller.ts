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
import { TypesService } from './types.service'
import { CreateTypeDto } from './dto/create-type.dto'
import { UpdateTypeDto } from './dto/update-type.dto'
import { TypeQueryOptionsDto } from './dto/query-type.dto'
import { ListOptionsDto } from '../_common/list-options.dto'
import { Serialize } from './../_common/serialize.interceptor'
import { GetProductDto } from './dto/get-type.dto'

@ApiTags('types')
@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Post()
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typesService.create(createTypeDto)
  }

  @Get()
  list(@Query() listType: ListOptionsDto) {
    return this.typesService.list(listType)
  }
  @HttpCode(200)
  @Post('query')
  query(
    @Query() listType: ListOptionsDto,
    @Body() options: TypeQueryOptionsDto,
  ) {
    return this.typesService.query(listType, options)
  }

  @Get(':id')
  @Serialize(GetProductDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTypeDto: UpdateTypeDto,
  ) {
    return this.typesService.update(id, updateTypeDto)
  }

  @Delete('remove/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesService.remove(id)
  }
  @Delete('delete/:id')
  softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesService.softDelete(id)
  }
  @Patch('restore/:id')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.typesService.restore(id)
  }
}
