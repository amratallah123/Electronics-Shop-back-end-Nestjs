import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { join } from 'path'

@Injectable()
export class PostgreConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres' as 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: parseInt(this.configService.get<string>('DATABASE_PORT')),
      database: this.configService.get<string>('DATABASE_NAME'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASS'),
      entities: [join(__dirname, '../', '/**/*.entity{.ts,.js}')],
      migrations: ['dist/migrations/**/*{.ts,.js}'],
      cli: { migrationsDir: 'src/migrations' },
      dropSchema: false,
      synchronize: true,
      logging: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  }
}
