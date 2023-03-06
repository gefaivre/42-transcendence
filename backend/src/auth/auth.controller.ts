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

    const access_token = await this.authService.getFortyTwoAccessToken(code);

    const ft_user = await this.authService.getFortyTwoUser(access_token);

    const user: CreateUserDto = {
        username: ft_user.login,
        password: ''
    }
    this.usersService.create(user)

    // send a jwt to the authenticated user
    const jwt = await this.authService.login(ft_user.login)
    console.log(jwt)

    // return jwt as a cookie to frontend
    res.cookie("jwt", jwt.access_token)
    return res.redirect('http://localhost:8080')
  }

}
