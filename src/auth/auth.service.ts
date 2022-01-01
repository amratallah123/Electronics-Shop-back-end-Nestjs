import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'

import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { MailerService } from '@nestjs-modules/mailer'
import { JwtService } from '@nestjs/jwt'

import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TokenPayload,
  TokensType,
  getAccessTokenExpiresDate,
  getRefreshTokenExpiresDate,
  UserVerificationType,
  ApiRequest,
} from './helpers/auth.types'

import { AccountStatus, ApiResponse } from 'src/_common/types'

import { User } from 'src/users/entities/user.entity'
import { CreateUserDto } from './../users/dtos/create-user.dto'
import { LoginUserDto } from './dtos/login-user.dto'
import { ActivateUserDto } from './dtos/activate-user.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  private createToken(payload: TokenPayload, expiresIn: string) {
    return this.jwtService.sign(payload, { expiresIn })
  }

  private setCookies(res: Response, tokens: TokensType) {
    res.cookie(ACCESS_TOKEN.key, tokens.accessToken, {
      expires: getAccessTokenExpiresDate(),
      httpOnly: true,
    })
    res.cookie(REFRESH_TOKEN.key, tokens.refreshToken, {
      expires: getRefreshTokenExpiresDate(),
      httpOnly: true,
    })
  }

  async createTokensAndSetCookies(user: User, response: Response) {
    try {
      const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      }
      const accessToken = this.createToken(
        payload,
        ACCESS_TOKEN.expiresIn,
      )
      const refreshToken = this.createToken(
        payload,
        REFRESH_TOKEN.expiresIn,
      )
      this.setCookies(response, { accessToken, refreshToken })
    } catch (error) {
      console.log(
        '🚀: AuthService -> createTokensAndSetCookies -> error',
        error.message,
      )
    }
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token)
  }

  async register(user: CreateUserDto): Promise<string> {
    // check if a user with the given email is already exists
    const existedUser = await this.repo.findOne({ email: user.email })
    if (existedUser) {
      throw new UnprocessableEntityException('email already exists!')
    }

    // hash user password and generate the verificationCode
    const hashedPassword = await bcrypt.hash(user.password, 12)
    const verificationCode = nanoid(10)
    // create the newUser entity
    let newUser = this.repo.create({
      ...user,
      password: hashedPassword,
      verificationCode
    })
    // save the newUser to db
    newUser =  await this.repo.save(newUser)

    // send confirmation mail to the new user
    this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Welcome to Tech-Store App - Confirm your Email',
      html: `
        <h3>Hi ${newUser.firstName} ${newUser.lastName}</>
        <p>Please use the code below to confirm your email</p>
        <p>${verificationCode}</p>
        <p>Thanks</p>
      `
    })

    // return the new user email
    return newUser.email
  }

  async activateUser(activateUserDto: ActivateUserDto, response: Response) {
    // get the user by email
    let currentUser = await this.repo.findOne({ email: activateUserDto.email })
    // check user exist
    if (!currentUser) {
      throw new BadRequestException('email not found!')
    }
    // check the verification code
    if(activateUserDto.verificationCode !== currentUser.verificationCode) {
      throw new BadRequestException('wrong code!')
    }

    // activate the user
    currentUser.status = AccountStatus.ACTIVE
    currentUser = await this.repo.save(currentUser)

    // then create tokens and set cookies
    await this.createTokensAndSetCookies(currentUser, response)

    // finally return the user info
    return currentUser
  }

  async login(loginDto: LoginUserDto, response: Response): Promise<User> {
    // check user email
    const currentUser = await this.repo.findOne({ email: loginDto.email })
    if (!currentUser) {
      throw new BadRequestException('invalid credentials!')
    }

    // check user password
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      currentUser.password,
    )
    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials!')
    }

    // if both are ok then create tokens and set cookies
    await this.createTokensAndSetCookies(currentUser, response)

    // finally return the user info
    return currentUser
  }

  logout(response: Response): ApiResponse {
    response.clearCookie(ACCESS_TOKEN.key)
    response.clearCookie(REFRESH_TOKEN.key)
    return {
      statusCode: 200,
      status: 'Ok',
      message: 'user logged out successfully'
    }
  }

  async refreshTokens(request: Request, response: Response) {
    let currentUser = (request as ApiRequest).currentUser
    if(currentUser) {
      return currentUser
    }

    if (request.cookies) {
      const refreshToken = request.cookies[REFRESH_TOKEN.key]
      console.log('🚀: AuthService => refreshTokens -> refreshToken', refreshToken)
      if (refreshToken) {
        try {
          const { email } = this.verifyToken(refreshToken) as TokenPayload
          if (email) {
            currentUser = await this.repo.findOne({ email })
            this.createTokensAndSetCookies(currentUser, response)
            return currentUser
          }
        } catch (error) {
          console.log('🚀: AuthService => refreshTokens -> refreshTokenError', error)
          throw new UnauthorizedException()
        }
      }
    }

    throw new UnauthorizedException()
  }

  currentUser(user: User): User {
    if (user) return user
    throw new UnauthorizedException()
  }

}
