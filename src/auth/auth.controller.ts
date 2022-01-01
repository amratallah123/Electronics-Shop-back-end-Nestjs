import {
  Controller,
  HttpCode,
  Get,
  Post,
  Req,
  Res,
  Body,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { Authorize } from './helpers/auth.guard'
import { Serialize } from 'src/_common/serialize.interceptor'
import { CurrentUser } from './helpers/current-user.decorator'

import { ApiResponse } from '../_common/types'
import { UserVerificationType } from './helpers/auth.types'

import { User } from 'src/users/entities/user.entity'
import { GetUserDto } from 'src/users/dtos/get-user.dto'
import { CreateUserDto } from 'src/users/dtos/create-user.dto'
import { LoginUserDto } from './dtos/login-user.dto'
import { ActivateUserDto } from './dtos/activate-user.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() registerDto: CreateUserDto,
  ): Promise<string> {
    return this.authService.register(registerDto)
  }

  @Post('activate-user')
  @HttpCode(200)
  activateUser(
    @Body() activateUserDto: ActivateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    return this.authService.activateUser(activateUserDto, res)
  }

  @Post('login')
  @HttpCode(200)
  @Serialize(GetUserDto)
  login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    return this.authService.login(loginDto, res)
  }

  @Get('refresh-tokens')
  @Serialize(GetUserDto)
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | UnauthorizedException> {
    return this.authService.refreshTokens(req, res)
  }

  @Authorize()
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response): ApiResponse {
    return this.authService.logout(res)
  }

  @Authorize()
  @Get('current-user')
  @Serialize(GetUserDto)
  GetCurrentUser(@CurrentUser() user: User): User {
    return this.authService.currentUser(user)
  }
}
