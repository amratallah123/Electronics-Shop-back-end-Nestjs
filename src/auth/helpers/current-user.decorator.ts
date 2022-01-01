import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ApiRequest } from '../helpers/auth.types'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as ApiRequest
    return request.currentUser
  },
)
