import { Request } from 'express'

import { UserRole } from 'src/_common/types'
import { User } from 'src/users/entities/user.entity'

export const getAccessTokenExpiresDate = () => {
  return new Date( Date.now() + (1000 * 60 * 60) )
}
export const getRefreshTokenExpiresDate = () => {
  return new Date( Date.now() + (1000 * 60 * 60 * 24 * 7) )
}
export const ACCESS_TOKEN = {
  key: 'access-token',
  expiresIn: '1h'
}
export const REFRESH_TOKEN = {
  key: 'refresh-token',
  expiresIn: '7d'
}

export type TokenPayload = {
  id: string
  email: string
  role: UserRole
}

export type TokensType = {
  accessToken: string
  refreshToken: string
}

export type ApiRequest = Request & {
  currentUser: User
}

export type UserVerificationType = {
  email: string
  verificationCode: string
}
