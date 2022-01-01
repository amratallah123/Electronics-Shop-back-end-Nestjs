import { Injectable, NestMiddleware } from '@nestjs/common'

import { NextFunction, Response } from 'express'

import { UsersService } from 'src/users/users.service'
import { AuthService } from '../auth.service'

import {
  ACCESS_TOKEN,
  ApiRequest,
  TokenPayload,
} from './auth.types'

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private userService: UsersService,
    private auhService: AuthService,
  ) {}

  async use(req: ApiRequest, res: Response, next: NextFunction) {
    if (req.cookies) {
      const accessToken = req.cookies[ACCESS_TOKEN.key]
      console.log('🚀: CurrentUserMiddleware -> accessToken', accessToken)

      if (accessToken) {
        try {
          const { email } = this.auhService.verifyToken(accessToken) as TokenPayload
          if (email) {
            req.currentUser = await this.userService.findEmail(email)
          }
        } catch (error) {
          console.log('🚀 CurrentUserMiddleware -> accessTokenError', error)
        }
      }
    }

    next()
  }
}
