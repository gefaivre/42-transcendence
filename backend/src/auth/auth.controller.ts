import { Controller, Get, Patch, Query, Res, Req, UseGuards, Post, Body, ConflictException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request} from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // If you cycle through this loop, well, someone stole your login (Ò.Ó)
  private async generateUsername(login: string) {
    while (await this.usersService.findByUsername(login))
      login = login + '_'
    return login
  }

  @Get('42')
  async auth42(@Query('code') code: string, @Res() response: Response) {

    // exchange code for access token
    const access_token = await this.authService.getFortyTwoAccessToken(code);

    // TODO (?): throw http exception
    // code we sent could have been wrong
    if (access_token == null)
      return response.redirect('http://localhost:8080')

    // exchange access token for user data
    const ft_user = await this.authService.getFortyTwoUser(access_token);

    // see if this 42 user already in db
    let user = await this.usersService.findByFortyTwoLogin(ft_user.login)

    // first conection: register in db
    if (!user) {

      let newUser: CreateUserDto = {
        username: await this.generateUsername(ft_user.login),
        password: '',
        ft_login: ft_user.login,
        image: new URL(ft_user.image.versions.small)
      }

      user = await this.usersService.create(newUser)

      // TODO
      if (user == null)
        return
    }

    // if 2FA enabled, we will issue a second jwt after authentication complete
    const jwtKey = user.TwoFA === true ? 'jwt2fa' : 'jwt'

    // bind a jwt to the authenticated user
    const jwtValue = this.authService.login(user)

    // return the jwt as a cookie into frontend
    response.cookie(jwtKey, jwtValue, { httpOnly: true })

    return user.TwoFA === true
    ? response.redirect('http://localhost:8080/#/2FA')
    : response.redirect('http://localhost:8080')
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {

    let hash

    // hash password
    try {
      hash = await bcrypt.hash(body.password, 2) // bigger salt would take too long
    } catch (e) {
      throw new UnprocessableEntityException('Error about your password encryption')
    }

    // create user
    body.password = hash
    const user = await this.usersService.create(body)
    if (user == null)
      throw new ConflictException('This username already exists')

    // remove password field from user object
    const { password, ...result } = user;

    // frontend need to login after
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) response: Response) {

    // if 2FA enabled, we will issue a second jwt after authentication complete
    const jwtKey = req.user.TwoFA === true ? 'jwt2fa' : 'jwt'

    // bind a jwt to the authenticated user
    const jwtValue = this.authService.login(req.user)

    // return the jwt as a cookie into frontend
    response.cookie(jwtKey, jwtValue, { httpOnly: true })

    // let the frontend know if it has to handle 2FA
    return jwtKey
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', { expires: new Date(0) });
  }

  // TODO (?): move into users controller (would be a conflict with other get routes though)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() request: any) {
    return request.user
  }

  // Step 1/2 to enable 2FA
  @UseGuards(AuthGuard('jwt'))
  @Patch('2FA/enable')
  enable2FA(@Req() request: any) {
    return this.authService.enable2FA(+request.user.id)
  }

  // Step 2/2 to enable 2FA
  @UseGuards(AuthGuard('jwt'))
  @Post('2FA/validate')
  async validate2FA(@Req() request: any, @Body() body: any) {

    const isValid: boolean = this.authService.validate2FA(body.token, request.user.id)

    // register in db
    if (isValid === true) {
      try {
        await this.usersService.update2FA(request.user.id, true)
      } catch(e) {
        throw new ConflictException()
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('2FA/disable')
  async disable2FA(@Req() request: any) {
    try {
      await this.usersService.update2FA(+request.user.id, false)
    } catch(e) {
      throw new ConflictException()
    }
  }

  @UseGuards(AuthGuard('jwt-2fa'))
  @Post('2FA/login')
  async login2FA(@Req() request: any, @Body() body: any, @Res({ passthrough: true }) response: Response) {

    const isValid: boolean = this.authService.validate2FA(body.token, request.user.id)

    if (isValid === true) {

      // bind the 'definitive' jwt to the authenticated user
      const jwt = this.authService.login(request.user)

      // return the jwt as a cookie into frontend
      response.cookie('jwt', jwt, { httpOnly: true })

      // expire the 'temporary' jwt only used for 2FA
      response.cookie('jwt2fa', '', { expires: new Date(0) });
    }

    // let the backend know if login succeeded
    return isValid
  }

}
