import { MiddlewareConsumer, Module } from '@nestjs/common'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailerModule } from '@nestjs-modules/mailer'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MulterModule } from '@nestjs/platform-express'
import { join } from 'path'

import { PostgreConfigService } from './_common/PostgreConfigService'
import { mailerConfigFactory } from './_common/mailerConfigFactory'
import { CurrentUserMiddleware } from './auth/helpers/current-user.middleware'

import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { BrandsModule } from './brands/brands.module'
import { CategoriesModule } from './categories/categories.module'
import { TypesModule } from './types/types.module'
import { ProductsModule } from './products/products.module'
import { PurchasesModule } from './purchases/purchases.module'
import { CartsModule } from './carts/carts.module'
import { RatesModule } from './rates/rates.module'
import { CommentsModule } from './comments/comments.module'
import { WishListsModule } from './wish-lists/wish-lists.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: PostgreConfigService,
      inject: [PostgreConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfigFactory,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MulterModule.register({
      dest: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UsersModule,
    BrandsModule,
    CategoriesModule,
    TypesModule,
    ProductsModule,
    PurchasesModule,
    CartsModule,
    RatesModule,
    CommentsModule,
    WishListsModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
