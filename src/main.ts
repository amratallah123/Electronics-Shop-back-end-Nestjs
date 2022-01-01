import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { join } from 'path'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // set Global Routes Prefix
  app.setGlobalPrefix('api')

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('Tech Store API')
    .setDescription('Tech Store API Using (Node, PostgreSQL, TypeORM, Nest)')
    .setVersion('1.0')
    .addTag('Tech_Store')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/swagger', app, document)

  // parse cookies
  app.use(cookieParser())

  // enable cors
  app.enableCors({ origin: '*', credentials: true })

  // setup global validation
  app.useGlobalPipes(
    new ValidationPipe(),
  )

  // run the app [web server]
  const PORT = process.env.PORT
  const BASE_URL = process.env.BASE_URL
  await app.listen(PORT, () =>
    console.log(`The Web Server is running on ${BASE_URL}:${PORT}`),
  )
}
bootstrap()
