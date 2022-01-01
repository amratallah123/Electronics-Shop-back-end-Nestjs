import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Files = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest()
    return request.files
  },
)
