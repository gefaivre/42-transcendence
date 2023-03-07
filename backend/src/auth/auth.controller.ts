import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService
    ) {}

  @Get('42')
  async auth42(@Query('code') code: string, @Res() res: Response) {

    // exchange code for access token
    const access_token = await this.authService.getFortyTwoAccessToken(code);

    // exchange access token for user data
    const ft_user = await this.authService.getFortyTwoUser(access_token);

    // register user in database (if not already the case)
    const user: CreateUserDto = { username: ft_user.login, password: '' }
    this.usersService.create(user)

    // bind a jwt to the authenticated user
    const jwt = await this.authService.loginFortyTwo(ft_user.login, ft_user.id)

    // return the jwt as a cookie into frontend
    res.cookie("jwt", jwt)

    // redirect to frontend
    return res.redirect('http://localhost:8080')

  }

}
