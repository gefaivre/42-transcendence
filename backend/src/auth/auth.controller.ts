import { Controller, Get, Query, Res, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService
    ) {}

  @Get('42')
  async auth42(@Query('code') code: string, @Res() response: Response) {

    // exchange code for access token
    const access_token = await this.authService.getFortyTwoAccessToken(code);

    // code we sent could have been wrong
    if (access_token == null)
      return response.redirect('http://localhost:8080')

    // exchange access token for user data
    const ft_user = await this.authService.getFortyTwoUser(access_token);

    // register user in database (if not already the case)
    this.usersService.create({ username: ft_user.login, password: '', ft_login: ft_user.username } as CreateUserDto)

    // bind a jwt to the authenticated user
    const jwt = await this.authService.loginFortyTwo(ft_user.login, ft_user.id)

    // return the jwt as a cookie into frontend
    response.cookie('jwt', jwt, { httpOnly: true })

    // redirect to frontend
    return response.redirect('http://localhost:8080')
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('login')
  login(@Request() request: any) {
    return request.user
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Res() response: Response) {
    response.cookie('jwt', '', { expires: new Date(0) });
    response.end()
  }

}
