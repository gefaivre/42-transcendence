import { Controller, Request, Get, Post, UseGuards, Query, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {

  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: any) {
    //console.log(req.user)
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: any) {
    //console.log(req.user);
    return req.user;
  }

  @Get('auth/42')
  async auth42(@Query('code') code: string, @Res() res: Response) {

    const access_token = await this.authService.getFortyTwoAccessToken(code);

    const fortytwouser = await this.authService.getFortyTwoUser(access_token);

    // add authenticated user to the database
    this.authService.signin(fortytwouser.login, "password")

    // send a jwt to the authenticated user
    const jwt = await this.authService.login(fortytwouser.login)
    console.log(jwt)

    // return jwt as a cookie to frontend
    res.cookie("jwt", jwt.access_token)
    return res.redirect('http://localhost:8080')
  }

}

