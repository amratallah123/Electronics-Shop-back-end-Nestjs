import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common'

import { Observable } from 'rxjs'

import { ApiRequest } from './auth.types'

export const Authorize = (...roles: string[]) => {
  return UseGuards(new AuthGuard(roles))
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as ApiRequest
    console.log('🚀: AuthGuard -> request.currentUser', request.currentUser)
    if (request.currentUser) {
      const { email, role } = request.currentUser
      if (email) {
        if (!this.roles.length || this.roles.includes(role))
          return true
      }
    }
    return false
  }
}
