import { Controller, Get, Post, Request, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  // TODO distinguish whether request succeded or failed
  @Post(':signin')
  async signin(@Request() req: any) {
    return this.authService.signin(req.body.username, req.body.password)
  }

  @Get(':42')
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
