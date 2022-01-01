import { Module } from '@nestjs/common'
import { TypesService } from './types.service'
import { TypesController } from './types.controller'
import { Type } from './entities/type.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from 'src/categories/entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Type, Category])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
